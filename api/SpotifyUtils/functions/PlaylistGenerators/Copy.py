from SpotifyUtils.user import User
import spotipy


def _playlist_tracks(sp, user: User, uri):
    results = sp.user_playlist_tracks(user.username, playlist_id=uri)
    tracks = []
    for track in results['items']:
        tracks.append(track['track']['uri'])
    while results['next']:
        results = sp.next(results)
        for track in results['items']:
            tracks.append(track['track']['uri'])
    return tracks


def Copy(user: User, origin_id, target_id):
    sp = spotipy.Spotify(user.token)
    tracks = _playlist_tracks(sp, user, origin_id)
    sp.user_playlist_replace_tracks(user, target_id, tracks)
