import SpotifyUtils.lyrics.genius as genius
# import SpotifyUtils.lyrics.youtube as youtube
from SpotifyUtils.song import Song
import time
from SpotifyUtils import APP

SOURCES = [genius]


def update_lyrics(song: Song):
    for source in SOURCES:
        if source.SOURCE_NAME == song.source:
            return
        # Check only once per day
        if song.last_check:
            if time.time() - song.last_check < 86400:
                return
        lyrics = source.get_lyrics(song)
        if lyrics is not None:
            APP.logger.info("Taken lyrics for %s from %s",
                            song.title, source.SOURCE_NAME)
            song.lyrics = lyrics
            song.source = source.SOURCE_NAME
            song.last_check = int(time.time())
            return

    song.last_check = int(time.time())
    APP.logger.info("Did not find any lyrics for %s",
                    song.title)
    return
