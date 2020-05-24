from SpotifyUtils.song import Song
from SpotifyUtils import db, login_manager
import spotipy


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

    def __init__(self, username, token):
        self.username = username
        self.token = token

    def valid(self):
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
        sp = spotipy.Spotify(self.token)
        playlists = sp.user_playlists(self.username)
        result = []
        for playlist in playlists['items']:
            result.append(
                Playlist(playlist['id'], playlist['name'], [])
            )
        while playlists['next']:
            playlists = sp.next(playlists)
            for playlist in playlists['items']:
                result.append(
                    Playlist(playlist['id'], playlist['name'], [])
                )
        return result

    def playlists_json(self):
        result = []
        for playlist in self.playlists():
            result.append(playlist.to_json())
        return result

    def is_authenticated(self):
        return True

    def is_anonymous(self):
        return False

    def is_active(self):
        return True

    def get_id(self):
        return self.id


@login_manager.user_loader
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
