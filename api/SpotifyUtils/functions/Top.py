import spotipy
import json
from SpotifyUtils.user import User
from time import time
from SpotifyUtils import db, APP


def Top(user: User):
    result = {
        "artists": [],
        "tracks": [],
        "genres": {}
    }
    # If the top has already been updated in the last day or token is invalid
    if not user.valid() or time() - user.top_updated < 86400:
        result["artists"] = json.loads(user.top_artists)
        result["tracks"] = json.loads(user.top_tracks)
        result["genres"] = json.loads(user.top_genres)
        APP.logger.debug("Loaded from database for %s", user.name)
        return result
    sp = spotipy.Spotify(user.token)

    APP.logger.debug("Loading from spotify for %s", user.name)
    # Update the top
    short_term_artists = sp.current_user_top_artists(
        time_range="short_term", limit=50)
    short_term_tracks = sp.current_user_top_tracks(
        time_range="short_term", limit=50)
    long_term = sp.current_user_top_artists(time_range="long_term", limit=50)
    for i in short_term_artists["items"]:
        result["artists"].append({
            "name": i["name"],
            "image": i["images"][0]["url"],
            "id": i["uri"]
        })

    for i in long_term["items"]:
        for genre in i["genres"]:
            if genre not in result["genres"]:
                result["genres"][genre] = 0
            result["genres"][genre] += 1

    for i in short_term_tracks["items"]:
        result["tracks"].append({
            "artist": i["artists"][0]["name"],
            "name": i["name"],
            "image": i["album"]["images"][0]["url"],
            "id": i["uri"],
            "duration": i["duration_ms"],
            "preview_url": i["preview_url"]
        })

    genres = sorted(
        result["genres"].items(), key=lambda item: item[1], reverse=True)
    result["genres"] = {}
    for idx, val in enumerate(genres):
        result["genres"][idx] = val[0]

    user.top_artists = json.dumps(result["artists"])
    user.top_tracks = json.dumps(result["tracks"])
    user.top_genres = json.dumps(result["genres"])
    user.top_updated = int(time())
    db.session.commit()

    return result
