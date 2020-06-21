from SpotifyUtils.user import User
from SpotifyUtils.song import Song
from SpotifyUtils.functions import Top


def FindSongInFriendsTop(target: User, song: Song):
    result = []
    for friend in target.friends:
        top = Top(friend)["tracks"]
        for track in top:
            if track["id"] == song.uri:
                result.append({
                    "username": friend.username,
                    "name": friend.name,
                    "image": friend.image,
                    "code": friend.friend_code
                })
                break

    return result
