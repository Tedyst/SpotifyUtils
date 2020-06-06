from flask import Blueprint
from flask_login import current_user
from threading import Thread
from SpotifyUtils.user import Playlist, User
import time
from SpotifyUtils.song import Song
from SpotifyUtils.lyrics import update_lyrics
from SpotifyUtils import db
import queue

lyrics_blueprint = Blueprint('lyrics', __name__)
query_queue = []


class Query():
    def __init__(self, user, playlist_id, total):
        self.user = user
        self.playlist_id = playlist_id
        self.result = []
        self.searched = 0
        self.notfound = []
        self.total = total


@lyrics_blueprint.route('/<playlist_id>')
def ajax(playlist_id):
    if not current_user.is_authenticated:
        return {"success": False,
                "error": "Not authorized"}, 403
    query = None
    for i in query_queue:
        if i.user == current_user.id and i.playlist_id == playlist_id:
            query = i
            break
    if query is None:
        query = Query(current_user.id, playlist_id, -1)
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
    user = User.query.filter(User.id == query.user).first()
    q = queue.Queue()
    playlist = Playlist(query.playlist_id, "", user)
    playlist.get()
    query.total = playlist.number
    threads = []
    threads = queue.Queue()
    # If we already checked just skip creating the thread
    for song in playlist.tracks:
        if type(song) != Song:
            continue

        # We cannot move the original object because it is tied to this thread
        copysong = Song(
            song.name, song.artist, song.uri, song.image, song.preview
        )
        copysong.lyrics = song.lyrics
        copysong.source = song.source
        copysong.last_check = song.last_check
        if copysong.lyrics:
            query.result.append(copysong)
            query.searched += 1
            continue

        if copysong.last_check:
            if time.time() - copysong.last_check < 86400:
                query.searched += 1
                continue

        threads.put([q, song, copysong])

    # Starting the threads
    for counter in range(0, min(10, threads.qsize())):
        args = threads.get()
        thread = Thread(target=update_lyrics_queue, args=args)
        thread.start()

    # Getting the result from the threads
    for counter in range(query.total - query.searched):
        song, copysong = q.get()
        if not threads.empty():
            args = threads.get()
            thread = Thread(target=update_lyrics_queue, args=args)
            thread.start()

        # Update song (the one tied to the database)
        song.lyrics = copysong.lyrics
        song.source = copysong.source
        song.last_check = copysong.last_check

        if copysong.lyrics:
            query.result.append(copysong)
        query.searched += 1
        db.session.commit()

    return


def update_lyrics_queue(q: queue.Queue, song: Song, copysong: Song):
    update_lyrics(copysong)
    q.put([song, copysong])
