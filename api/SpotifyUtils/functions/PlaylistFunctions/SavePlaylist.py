from SpotifyUtils.user import User
import spotipy


def SavePlaylist(target: User, tracks):
    sp = spotipy.Spotify(target.token)
    playlist_id = None
    user_playlists = sp.current_user_playlists()
    for playlist in user_playlists["items"]:
        if playlist["name"] == "Spotify Utils Playlist":
            playlist_id = playlist["uri"]
    if playlist_id is None:
        playlist_id = sp.user_playlist_create(
            target.username, "Spotify Utils Playlist")["uri"]
    sp.user_playlist_replace_tracks(target.username, playlist_id, tracks)
