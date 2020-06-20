from SpotifyUtils.user import User
import spotipy

PLAYLIST_NAME = "Spotify Utils Playlist"
DESCRIPTION = "Playlist generated at spotify.stoicatedy.ovh"


def SavePlaylist(target: User, tracks):
    sp = spotipy.Spotify(target.token)
    playlist_id = None
    user_playlists = sp.current_user_playlists()
    for playlist in user_playlists["items"]:
        if playlist["name"] == PLAYLIST_NAME:
            playlist_id = playlist["uri"]
    if playlist_id is None:
        playlist_id = sp.user_playlist_create(
            target.username,
            PLAYLIST_NAME,
            public=False,
            description=DESCRIPTION)["uri"]
    sp.user_playlist_replace_tracks(target.username, playlist_id, tracks)
    return playlist_id
