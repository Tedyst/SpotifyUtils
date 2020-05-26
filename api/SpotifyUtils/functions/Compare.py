import spotipy
from SpotifyUtils.user import User
from SpotifyUtils.functions.Top import Top


def Compare(initiator: User, target: User):
    top_initiator = Top(initiator)
    top_target = Top(target)

    result = {
        "percent": 0,
        "artists": [],
        "tracks": [],
        "genres": []
    }

    score = 0
    total = 0
    for idx, val in enumerate(top_initiator["artists"]):
        total += 3
        for idx1, val1 in enumerate(top_target["artists"]):
            if val1 == val:
                score += 3
                copy = {
                    "initiator": idx,
                    "target": idx1
                }
                copy.update(val)
                result["artists"].append(copy)
    for idx, val in enumerate(top_initiator["tracks"]):
        total += 2
        for idx1, val1 in enumerate(top_target["tracks"]):
            if val1 == val:
                score += 2
                copy = {
                    "initiator": idx,
                    "target": idx1
                }
                copy.update(val)
                result["tracks"].append(copy)
    for idx, val in top_initiator["genres"].items():
        total += 4
        for idx1, val1 in top_target["genres"].items():
            if val1 == val:
                score += 4
                copy = {
                    "initiator": int(idx) + 1,
                    "target": int(idx1) + 1,
                    "name": val
                }
                result["genres"].append(copy)
    result["percent"] = int(score/total * 100)
    return result
