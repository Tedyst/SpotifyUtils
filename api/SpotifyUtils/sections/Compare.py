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
    for i in sp.current_user_top_artists(time_range="short_term", limit=50)["items"]:
        initiator["artists"].append({
            "name": i["name"],
            "image": i["images"][0]["url"],
            "id": i["uri"]
        })
    for i in sp.current_user_top_artists(time_range="long_term", limit=50)["items"]:
        for genre in i["genres"]:
            if genre not in initiator["genres"]:
                initiator["genres"][genre] = 0
            initiator["genres"][genre] += 1
    for i in sp.current_user_top_tracks(time_range="short_term", limit=50)["items"]:
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

    initiator["genres"] = {k: v for k, v in sorted(
        initiator["genres"].items(), key=lambda item: item[1], reverse=True)}
    target["genres"] = {k: v for k, v in sorted(
        target["genres"].items(), key=lambda item: item[1], reverse=True)}
    score = 0
    total = 0
    for idx, val in enumerate(initiator["artists"]):
        total += 3
        for idx1, val1 in enumerate(target["artists"]):
            if val1 == val:
                score += 3
                copy = {
                    "initiator": idx,
                    "target": idx1
                }
                copy.update(val)
                result["artists"].append(copy)
    for idx, val in enumerate(initiator["tracks"]):
        total += 2
        for idx1, val1 in enumerate(target["tracks"]):
            if val1 == val:
                score += 2
                copy = {
                    "initiator": idx,
                    "target": idx1
                }
                copy.update(val)
                result["tracks"].append(copy)
    for idx, val in enumerate(initiator["genres"]):
        total += 2
        for idx1, val1 in enumerate(target["genres"]):
            if val1 == val:
                score += 2
                copy = {
                    "initiator": idx + 1,
                    "target": idx1 + 1,
                    "name": val
                }
                result["genres"].append(copy)
    result["percent"] = int(total/score * 100)
    return result
