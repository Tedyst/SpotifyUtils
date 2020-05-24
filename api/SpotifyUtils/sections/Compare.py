from flask import Blueprint
from flask_login import current_user
from SpotifyUtils.user import User
from SpotifyUtils import db
import spotipy
import json

compare_blueprint = Blueprint('compare', __name__)


@compare_blueprint.route('/<user>')
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
    # Update the top for the initiator
    initiator = {
        "artists": [],
        "tracks": [],
        "genres": {}
    }
    sp = spotipy.Spotify(current_user.token)
    for i in sp.current_user_top_artists(time_range="short_term")["items"]:
        initiator["artists"].append({
            "name": i["name"],
            "image": i["images"][0]["url"],
            "id": i["uri"]
        })
        for genre in i["genres"]:
            if genre not in initiator["genres"]:
                initiator["genres"][genre] = 0
            initiator["genres"][genre] += 1
    for i in sp.current_user_top_tracks(time_range="short_term")["items"]:
        initiator["tracks"].append({
            "artist": i["artists"][0]["name"],
            "name": i["name"],
            "image": i["album"]["images"][0]["url"],
            "id": i["uri"],
            "duration": i["duration_ms"],
            "preview_url": i["preview_url"]
        })
    current_user.top_artists = json.dumps(initiator["artists"])
    current_user.top_tracks = json.dumps(initiator["tracks"])
    current_user.top_genres = json.dumps(initiator["genres"])
    db.session.commit()

    target = {
        "artists": [],
        "tracks": [],
        "genres": {}
    }
    target["artists"] = json.loads(user.top_artists)
    target["tracks"] = json.loads(user.top_tracks)
    target["genres"] = json.loads(user.top_genres)

    result = {
        "percent": 0,
        "artists": [],
        "tracks": [],
        "genres": []
    }
    return result
