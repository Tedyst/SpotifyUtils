from flask import Blueprint
from flask_login import current_user
from SpotifyUtils.user import User
from SpotifyUtils import db
import spotipy
import json

top_blueprint = Blueprint('top', __name__)


@top_blueprint.route('/me')
def me():
    if not current_user.is_authenticated:
        return {"logged": False}
    sp = spotipy.Spotify(current_user.token)
    result = {
        "artists": [],
        "tracks": [],
        "genres": {}
    }

    for i in sp.current_user_top_artists(time_range="short_term")["items"]:
        result["artists"].append({
            "name": i["name"],
            "image": i["images"][0]["url"],
            "id": i["uri"]
        })
        for genre in i["genres"]:
            if genre not in result["genres"]:
                result["genres"][genre] = 0
            result["genres"][genre] += 1

    for i in sp.current_user_top_tracks(time_range="short_term")["items"]:
        result["tracks"].append({
            "artist": i["artists"][0]["name"],
            "name": i["name"],
            "image": i["album"]["images"][0]["url"],
            "id": i["uri"],
            "duration": i["duration_ms"],
            "preview_url": i["preview_url"]
        })

    current_user.top_artists = json.dumps(result["artists"])
    current_user.top_tracks = json.dumps(result["tracks"])
    current_user.top_genres = json.dumps(result["genres"])
    db.session.commit()

    return result


@top_blueprint.route('/<user>')
def user(user):
    if not current_user.is_authenticated:
        return {"logged": False}
    user = User.query.filter(User.username == user).first()
    if user is None:
        return {
            "logged": True,
            "success": False,
            "error": "User does not exist"
        }
    result = {
        "artists": [],
        "tracks": [],
        "genres": {}
    }

    if not user.top_tracks and not user.top_artists:
        return {
            "logged": True,
            "success": False,
            "error": "User does not have top stats"
        }

    result["artists"] = json.loads(user.top_artists)
    result["tracks"] = json.loads(user.top_tracks)
    result["genres"] = json.loads(user.top_genres)

    return result
