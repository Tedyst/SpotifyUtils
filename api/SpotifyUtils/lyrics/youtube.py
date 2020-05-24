import youtube_dl
from SpotifyUtils import APP, Song


SOURCE_NAME = "Youtube"
# Init things
ydl_opts = {
    'quiet': True,
    'skip_download': True,
}
ydl = youtube_dl.YoutubeDL(ydl_opts)


def get_lyrics(song: Song):
    lyrics = ""
    result = ydl.extract_info("ytsearch:" + song.title)
    description = result['entries'][0]['description']
    if "Lyrics:" in description:
        lyrics = description.split('Lyrics:')[1]
    elif "Lyrics" in description:
        lyrics = description.split('Lyrics')[1]
    elif "L Y R I C S:" in description:
        lyrics = description.split('L Y R I C S:')[1]
    elif "L Y R I C S" in description:
        lyrics = description.split('L Y R I C S')[1]
    else:
        APP.logger.debug(
            "Did not find youtube lyrics for %s", song.title)
        return None
    APP.logger.debug("Found youtube lyrics for %ss", song.title)
    return lyrics
