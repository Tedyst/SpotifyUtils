from SpotifyUtils.user import User
from SpotifyUtils.functions.RandomSongsFromTop import RandomSongsFromTop
import random


def FriendsTop(target: User):
    result = []
    for friend in target.friends:
        for song in RandomSongsFromTop(friend, random.randint(2, 5)):
            if song not in result:
                result.append({
                    "song": song,
                    "soruce": {
                        "name": friend.name,
                        "username": friend.username,
                        "code": friend.friend_code
                    }
                })

    random.shuffle(result)
    return result
