from SpotifyUtils import db, login_manager
from SpotifyUtils.playlist import Playlist
import spotipy


class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50))
    displayname = db.Column(db.String(50))
    token = db.Column(db.String(100))

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
        for playlist in self.playlists:
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
