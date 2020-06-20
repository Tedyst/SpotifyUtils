from flask import Blueprint
from flask_login import current_user

import spotipy
from SpotifyUtils.user import Song
from SpotifyUtils.functions import Track, Album
from SpotifyUtils import db, APP

from SpotifyUtils.lyrics import update_lyrics

track_blueprint = Blueprint('track', __name__)


@track_blueprint.route('/<id>')
def track(id):
    if not current_user.is_authenticated:
        return {"success": False,
                "error": "Not authorized"}, 403
    if "spotify:track:" in id:
        song = Song.query.filter(Song.uri == id).first()
    else:
        song = Song.query.filter(Song.uri == "spotify:track:" + id).first()
    if song is None:
        try:
            sp = spotipy.Spotify(current_user.token)
            spotify_info = sp.track(id)
        except spotipy.exceptions.SpotifyException:
            APP.logger.error("Invalid track id %s", id)
            return {"success": False,
                    "error": "Invalid Track"}, 400
        song = Song(
            spotify_info['name'],
            spotify_info['artists'][0]['name'],
            spotify_info['uri'],
            spotify_info['album']['images'][0]['url'],
            spotify_info['preview_url']
        )
        db.session.add(song)
    update_lyrics(song)
    return {
        "success": True,
        "analyze": Track(current_user, song),
        "track": song.__json__(),
        "album": Album(current_user, song)
    }
