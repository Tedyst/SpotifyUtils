from flask import Blueprint
from flask_login import current_user

import spotipy
from SpotifyUtils.user import User, Song
from SpotifyUtils.functions import Track
from SpotifyUtils import db

track_blueprint = Blueprint('track', __name__)


@track_blueprint.route('/<id>')
def track(id):
    if not current_user.is_authenticated:
        return {"logged": False}
    song = Song.query.filter(Song.id == id).first()
    if song is None:
        sp = spotipy.Spotify(current_user.token)
        spotify_info = sp.track(id)
        song = Song(
            spotify_info['name'],
            spotify_info['artists'][0]['name'],
            spotify_info['uri'],
            spotify_info['album']['images'][0]['url'],
            spotify_info['preview_url']
        )
        db.session.add(song)
    return Track(current_user, song)
