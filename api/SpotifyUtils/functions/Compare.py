from SpotifyUtils.user import User
from SpotifyUtils.functions.Top import Top
from SpotifyUtils import APP


def _Compare(initiator: User, target: User):
    top_initiator = Top(initiator)
    top_target = Top(target)

    result = {
        "percent": 0,
        "artists": [],
        "tracks": [],
        "genres": []
    }

    artist_total = 1
    artist_score = 0
    artist_max = max(len(top_initiator["artists"]), len(top_target["artists"]))
    for idx, val in enumerate(top_initiator["artists"]):
        artist_total += artist_max - idx
        for idx1, val1 in enumerate(top_target["artists"]):
            if val1 == val:
                artist_score += artist_max - idx1
                copy = {
                    "initiator": idx,
                    "target": idx1
                }
                copy.update(val)
                result["artists"].append(copy)
    tracks_total = 1
    tracks_score = 0
    tracks_max = max(len(top_initiator["tracks"]), len(top_target["tracks"]))
    for idx, val in enumerate(top_initiator["tracks"]):
        tracks_total += tracks_max - idx
        for idx1, val1 in enumerate(top_target["tracks"]):
            if val1 == val:
                tracks_score += tracks_max - idx1
                copy = {
                    "initiator": idx,
                    "target": idx1
                }
                copy.update(val)
                result["tracks"].append(copy)
    genre_total = 1
    genre_score = 0
    genre_max = max(len(top_initiator["genres"]), len(top_target["genres"]))
    for idx, val in top_initiator["genres"].items():
        genre_total += genre_max - int(idx)
        for idx1, val1 in top_target["genres"].items():
            if val1 == val:
                genre_score += genre_max - int(idx1)
                copy = {
                    "initiator": int(idx) + 1,
                    "target": int(idx1) + 1,
                    "name": val
                }
                result["genres"].append(copy)
    result["percent"] += (tracks_score / tracks_total) * 150
    result["percent"] += (artist_score / artist_total) * 100
    result["percent"] += (genre_score / genre_total) * 80

    if(result["percent"] > 100):
        APP.logger.info("%s and %s got %s%%! Nice!" %
                        (initiator.username, target.username, result["percent"]))
    result["percent"] = min(int(result["percent"]), 100)
    APP.logger.debug("%s and %s got %s%%" %
                     (initiator.username, target.username, result["percent"]))
    return result


def Compare(initiator: User, target: User):
    result = {
        "initiator": {
            "username": initiator.username,
            "name": initiator.name,
            "image": initiator.image,
            "code": initiator.friend_code
        },
        "target": {
            "username": target.username,
            "name": target.name,
            "image": target.image,
            "code": target.friend_code
        },
        "percent": 0,
        "artists": [],
        "tracks": [],
        "genres": []
    }
    APP.logger.debug("Comparing %s and %s" %
                     (initiator.username, target.username))
    compare1 = _Compare(initiator, target)
    compare2 = _Compare(target, initiator)
    if compare1["percent"] < compare2["percent"]:
        result.update(compare2)
    else:
        result.update(compare1)
    return result
