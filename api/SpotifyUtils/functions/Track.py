from SpotifyUtils.user import User, Song
from SpotifyUtils import APP, db
import spotipy
import json


def Track(initiator: User, song: Song):
    if song.analyzed:
        return {
            "loudness": json.loads(song.loudness),
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
    loudness = []
    for segment in analysis["segments"]:
        loudness.append({
            "duration": segment["duration"],
            "loudness": segment["loudness_max"]
        })

    song.analyzed = True
    song.loudness = json.dumps(loudness)
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
    return result
