from flask import Blueprint
from flask_login import current_user
from threading import Thread
from SpotifyUtils.user import Playlist
import time
from SpotifyUtils.song import Song
import regex
from SpotifyUtils.lyrics import update_lyrics
from SpotifyUtils import db

playlistsearcher_blueprint = Blueprint('playlistsearcher', __name__)
query_queue = []


class Query():
    def __init__(self, user, playlist_id, words, total):
        self.user = user
        self.playlist_id = playlist_id
        self.words = words
        self.result = []
        self.searched = 0
        self.notfound = []
        self.total = total


@playlistsearcher_blueprint.route('/<playlist_id>/<words>')
def ajax(playlist_id, words):
    if not current_user.is_authenticated:
        return {"logged": False}
    query = None
    for i in query_queue:
        if i.user == current_user.id and i.words == words and i.playlist == playlist_id:
            query = i
            break
    if query is None:
        query = Query(current_user.id, playlist_id, words, 0)
        query_queue.append(query)
        thread = Thread(target=search_thread, args=[query])
        thread.start()
    result = {
        "finished": True,
        "total": query.total,
        "searched": query.searched,
        "notfound": [i.__json__() for i in query.notfound],
        "results": [i.__json__() for i in query.result]
    }
    if query.searched != query.total:
        result["finished"] = False
    return result


def search_thread(query: Query):
    playlist = Playlist(query.playlist_id, "", query.user)
    playlist.get()
    threads = []
    words = query.words.lower()
    for song in playlist.tracks:
        if type(song) != Song:
            continue
        if song.last_check:
            if time.time() - song.last_check < 86400:
                # Check now, do not create another thread
                if song.lyrics:
                    if len(words) < 8:
                        re = regex.search(
                            rf'({words}){{e<=1}}', song.lyrics.lower())
                    else:
                        re = regex.search(
                            rf'({words}){{e<=3}}', song.lyrics.lower())
                    if re is not None:
                        query.result.append(song)
                else:
                    query.notfound.append(song)
                query.searched += 1
                continue

        copysong = Song(
            song.name, song.artist, song.uri, song.image, song.preview
        )
        copysong.lyrics = song.lyrics
        copysong.source = song.source
        copysong.last_check = song.last_check
        thread = Thread(target=update_lyrics,
                        args=[copysong])
        thread.start()
        threads.append([thread, copysong, song])

    for couple in threads:
        thread.join()
        thread = couple[0]
        song = couple[1]
        originalsong = couple[2]
        originalsong.lyrics = song.lyrics
        originalsong.source = song.source
        originalsong.last_check = song.last_check
        if song.lyrics:
            re = regex.search(
                rf'({words}){{e<=3}}', song.lyrics.lower())
            if re is not None:
                query.result.append(song)
        else:
            query.notfound.append(song)
        query.searched += 1
    db.session.commit()
    return
