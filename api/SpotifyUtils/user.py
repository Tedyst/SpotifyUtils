from SpotifyUtils.song import Song
from SpotifyUtils import db, login_manager, APP, admin
import spotipy
from sqlalchemy.schema import Table, ForeignKey
from sqlalchemy.orm import relationship, backref
import uuid
import time
import json
from flask_admin.contrib.sqla import ModelView
from flask_login import current_user
import SpotifyUtils.config as config
from flask import redirect, url_for
from requests.exceptions import RetryError

friends_table = Table(
    'friends',
    db.Model.metadata,
    db.Column('id', db.Integer, primary_key=True),
    db.Column('user1', db.Integer, ForeignKey('users.id')),
    db.Column('user2', db.Integer, ForeignKey('users.id'))
)


class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50))
    displayname = db.Column(db.String(50))
    image = db.Column(db.String(200))
    token = db.Column(db.String(250))
    top_tracks = db.Column(db.String(100000))
    top_artists = db.Column(db.String(10000))
    top_genres = db.Column(db.String(10000))
    top_updated = db.Column(db.Integer)
    friend_code = db.Column(db.String(6))
    last_updated = db.Column(db.Integer)
    user_playlists = db.Column(db.String(10000))
    refresh_token = db.Column(db.String(200))

    friends = relationship(
        'User',
        secondary=friends_table,
        primaryjoin=id == friends_table.c.user1,
        secondaryjoin=id == friends_table.c.user2,
        backref=backref('children')
    )

    def __init__(self, username, token):
        self.username = username
        self.token = token
        self.last_updated = time.time()
        self.top_updated = 0

        # Generate unique code
        code = uuid.uuid4().hex[:5].upper()
        while(User.query.filter(User.friend_code == code).first()):
            code = uuid.uuid4().hex[:5].upper()
        self.friend_code = code

    def refresh(self):
        APP.logger.debug(
            "Started refresh token for %s", self.name)
        try:
            sp_oauth = spotipy.oauth2.SpotifyOAuth(
                config.SPOTIFY_CLIENT_ID,
                config.SPOTIFY_CLIENT_SECRET,
                "https://spotify.stoicatedy.ovh/auth",
                scope=config.SCOPE)
            token_info = sp_oauth.refresh_access_token(
                self.refresh_token)
            APP.logger.debug(
                "Got new access token for %s", self.name)
            self.token = token_info["access_token"]
            self.last_updated = time.time()
            db.session.commit()
        except Exception:
            return False
        return True

    def valid(self):
        if self.token is None:
            return False
        if self.last_updated:
            if time.time() - self.last_updated > 600:
                return self.refresh()
            else:
                return True
        sp = spotipy.Spotify(self.token)
        try:
            me = sp.me()
        except spotipy.client.SpotifyException:
            pass
        if me['id'] == self.username:
            return True
        # Retry
        return self.refresh()

    @property
    def name(self):
        if self.displayname:
            return self.displayname
        return self.username

    def recent_tracks(self):
        if not self.valid():
            return []
        sp = spotipy.Spotify(self.token)
        result = []
        changed = False
        for track in sp.current_user_recently_played()["items"]:
            track_db = Song.query.filter(
                Song.uri == track["track"]["uri"]).first()
            if track_db is None:
                track_db = Song(
                    track["track"]['name'],
                    track["track"]['artists'][0]['name'],
                    track["track"]['uri'],
                    track["track"]['album']['images'][0]['url'],
                    track["track"]['preview_url']
                )
                db.session.add(track_db)
                changed = True
            if track_db in result:
                continue
            result.append(track_db)
        if changed:
            db.session.commit()
        return result

    def playlists(self):
        if not self.valid():
            return json.loads(self.user_playlists)

        try:
            sp = spotipy.Spotify(self.token)
            playlists = sp.user_playlists(self.username)
        except RetryError as e:
            APP.logger.error("Error loading playlists for %s", self.username)
            APP.logger.error(e)
            self.setInvalid()
            return []

        result = []
        for playlist in playlists['items']:
            result.append(
                Playlist(playlist['id'], playlist['name'], self)
            )
        while playlists['next']:
            playlists = sp.next(playlists)
            for playlist in playlists['items']:
                result.append(
                    Playlist(playlist['id'], playlist['name'], self)
                )
        playlists_db = []
        for playlist in result:
            playlists_db.append(playlist.to_json())
        self.user_playlists = json.dumps(playlists_db)
        db.session.commit()
        return result

    def playlists_json(self):
        result = []
        for playlist in self.playlists():
            result.append(playlist.to_json())
        return result

    def add_friend(self, user):
        user.friends += self

    @property
    def is_authenticated(self):
        return self.valid()

    def is_anonymous(self):
        return False

    def is_active(self):
        return True

    def get_id(self):
        return self.id

    def setInvalid(self):
        self.last_updated = time.time() - 10000  # Force loading


@ login_manager.user_loader
def load_user(user_id):
    return User.query.filter(User.id == user_id).first()


class Playlist():
    def __init__(self, id, name, user):
        self.id = id
        self.name = name
        self.user = user
        self.number = 0
        self.tracks = []

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "tracks": self.tracks
        }

    def get(self):
        sp = spotipy.Spotify(self.user.token)
        playlist_info = sp.playlist(self.id, market="RO")
        self.name = playlist_info['name']
        self.number = playlist_info['tracks']['total']
        result = []
        tracks = _playlist_tracks(sp, self.user, self.id)
        for spotify_info in tracks:
            exists = Song.query.filter(Song.artist == spotify_info['artists'][0]['name']).filter(
                Song.name == spotify_info['name']).first()
            if not exists:
                exists = Song(
                    spotify_info['name'],
                    spotify_info['artists'][0]['name'],
                    spotify_info['uri'],
                    spotify_info['album']['images'][0]['url'],
                    spotify_info['preview_url']
                )
                db.session.add(exists)
            result.append(exists)
        db.session.commit()
        self.tracks = result


def _playlist_tracks(sp, user: User, uri):
    results = sp.user_playlist_tracks(user.username, playlist_id=uri)
    tracks = []
    for track in results['items']:
        tracks.append(track['track'])
    while results['next']:
        results = sp.next(results)
        for track in results['items']:
            tracks.append(track['track'])
    return tracks


class FlaskAdminSong(ModelView):

    column_exclude_list = ('lyrics', 'loudness_graph', 'image', 'preview')

    def is_accessible(self):
        if not current_user.is_authenticated:
            return False
        if current_user.username == config.ADMIN:
            return True
        return False

    def inaccessible_callback(self, name, **kwargs):
        return redirect(url_for('catch_all'))


class FlaskAdminUser(ModelView):

    column_exclude_list = ('token', 'top_tracks',
                           'top_artists', 'top_genres', 'user_playlists',
                           'image', 'refresh_token')

    def is_accessible(self):
        if not current_user.is_authenticated:
            return False
        if current_user.username == config.ADMIN:
            return True
        return False

    def inaccessible_callback(self, name, **kwargs):
        return redirect(url_for('catch_all'))


admin.add_view(FlaskAdminUser(User, db.session))
admin.add_view(FlaskAdminSong(Song, db.session))
