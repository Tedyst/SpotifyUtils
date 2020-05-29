from SpotifyUtils.song import Song
from SpotifyUtils import db, login_manager, APP
import spotipy
from sqlalchemy.schema import Table, ForeignKey
from sqlalchemy.orm import relationship, backref
import uuid
import time
import json

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
    image = db.Column(db.String(50))
    token = db.Column(db.String(100))
    top_tracks = db.Column(db.String(10000))
    top_artists = db.Column(db.String(10000))
    top_genres = db.Column(db.String(10000))
    top_updated = db.Column(db.Integer)
    friend_code = db.Column(db.String(6))
    last_updated = db.Column(db.Integer)
    user_playlists = db.Column(db.String(10000))

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

    def valid(self):
        if self.last_updated:
            if time.time() - self.last_updated > 600:
                APP.logger.debug(
                    "%s's token is expired, not updating", self.name)
                return False
            else:
                APP.logger.debug(
                    "%s's token should be valid", self.name)
                return True
        if self.token is None:
            return False
        sp = spotipy.Spotify(self.token)
        try:
            me = sp.me()
        except spotipy.client.SpotifyException:
            return False
        if me is None:
            return False
        if me['id'] != self.username:
            return False
        return True

    @property
    def name(self):
        if self.displayname:
            return self.displayname
        return self.username

    def playlists(self):
        if not self.valid():
            return json.loads(self.user_playlists)
        sp = spotipy.Spotify(self.token)
        playlists = sp.user_playlists(self.username)
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

    def is_authenticated(self):
        return True

    def is_anonymous(self):
        return False

    def is_active(self):
        return True

    def get_id(self):
        return self.id


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
