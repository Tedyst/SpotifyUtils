from SpotifyUtils.user import User, Song
from SpotifyUtils import APP, db
import spotipy
import json


def Track(initiator: User, song: Song):
    if song.analyzed:
        cache = json.loads(song.loudness)
        loudness = {
            "label": [i for i in range(0, len(cache))],
            "data": cache
        }
        return {
            "loudness_graph": loudness,
            "duration": song.duration,
            "key": song.key,
            "key_confidence": song.key_confidence,
            "mode": song.mode,
            "tempo": song.tempo,
            "tempo_confidence": song.tempo_confidence,
            "time_signature": song.time_signature,
            "time_signature_confidence": song.time_signature_confidence,
            "acousticness": song.acousticness,
            "danceability": song.danceability,
            "energy": song.energy,
            "liveness": song.liveness,
            "loudness": song.loudness,
            "speechiness": song.speechiness,
            "instrumentalness": song.instrumentalness,
            "valence": song.valence
        }
    sp = spotipy.Spotify(initiator.token)
    analysis = sp.audio_analysis(song.uri)
    features = sp.audio_features(song.uri)
    loudness = []

    # Skip some seconds, too many points to store and visualise
    index = 4
    for segment in analysis["segments"]:
        index += 1
        if index == 5:
            loudness.append(segment["loudness_max"])
            index = 0

    APP.logger.debug("Analyzed song %s", song.uri)
    song.analyzed = True
    song.loudness = json.dumps(loudness)
    song.duration = analysis["track"]["duration"]
    song.key = analysis["track"]["key"]
    song.key_confidence = analysis["track"]["key_confidence"]
    song.mode = analysis["track"]["mode"]
    song.tempo = analysis["track"]["tempo"]
    song.tempo_confidence = analysis["track"]["tempo_confidence"]
    song.time_signature = analysis["track"]["time_signature"]
    song.time_signature_confidence = analysis["track"]["time_signature_confidence"]

    song.acousticness = features[0]["acousticness"]
    song.danceability = features[0]["danceability"]
    song.energy = features[0]["energy"]
    song.liveness = features[0]["liveness"]
    song.loudness = features[0]["loudness"]
    song.speechiness = features[0]["speechiness"]
    song.instrumentalness = features[0]["instrumentalness"]
    song.valence = features[0]["valence"]
    db.session.commit()
    return {
        "loudness_graph": loudness,
        "duration": analysis["track"]["duration"],
        "key": analysis["track"]["key"],
        "key_confidence": analysis["track"]["key_confidence"],
        "mode": analysis["track"]["mode"],
        "tempo": analysis["track"]["tempo"],
        "tempo_confidence": analysis["track"]["tempo_confidence"],
        "time_signature": analysis["track"]["time_signature"],
        "time_signature_confidence": analysis["track"]["time_signature_confidence"],
        "acousticness": features[0]["acousticness"],
        "danceability": features[0]["danceability"],
        "energy": features[0]["energy"],
        "liveness": features[0]["liveness"],
        "loudness": features[0]["loudness"],
        "speechiness": features[0]["speechiness"],
        "instrumentalness": features[0]["instrumentalness"],
        "valence": features[0]["valence"]
    }
