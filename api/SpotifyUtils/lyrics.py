import regex
from SpotifyUtils.lyrics import update_lyrics
from SpotifyUtils.song import Song


def strip_words(words):
    return words.split('&')[0].split(',')[0].lower()


def search_words(list_of_songs, words):
    result = []
    for song in list_of_songs:
        if type(song) != Song:
            continue
        update_lyrics(song)
        if song.lyrics:
            if len(words) < 8:
                re = regex.search(
                    rf'({words}){{e<=1}}', song.lyrics.lower())
            else:
                re = regex.search(
                    rf'({words}){{e<=3}}', song.lyrics.lower())
            if re is not None:
                result.append(song)
    return song
