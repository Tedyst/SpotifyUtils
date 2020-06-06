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
            "loudness": loudness,
            "duration": song.duration,
            "key": song.key,
            "key_confidence": song.key_confidence,
            "mode": song.mode,
            "tempo": song.tempo,
            "tempo_confidence": song.tempo_confidence,
            "time_signature": song.time_signature,
            "time_signature_confidence": song.time_signature_confidence
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
    db.session.commit()
    result = {
        "loudness": loudness,
        "duration": analysis["track"]["duration"],
        "key": analysis["track"]["key"],
        "key_confidence": analysis["track"]["key_confidence"],
        "mode": analysis["track"]["mode"],
        "tempo": analysis["track"]["tempo"],
        "tempo_confidence": analysis["track"]["tempo_confidence"],
        "time_signature": analysis["track"]["time_signature"],
        "time_signature_confidence": analysis["track"]["time_signature_confidence"],
    }
    return {"features": features}
