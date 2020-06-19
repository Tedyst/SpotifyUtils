from SpotifyUtils.user import User, Song
from SpotifyUtils.functions.Track import Track


def Album(initiator: User, song: Song):
    if song.analyzed:
        return {
            "markets": song.album_markets,
            "popularity": song.album_popularity,
            "release": song.album_release,
            "tracks": song.album_tracks
        }
    # Get the track info
    Track(initiator, song)

    return {
        "markets": song.album_markets,
        "popularity": song.album_popularity,
        "release": song.album_release,
        "tracks": song.album_tracks
    }
