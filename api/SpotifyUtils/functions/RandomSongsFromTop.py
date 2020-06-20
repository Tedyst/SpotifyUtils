from SpotifyUtils.user import User
from SpotifyUtils.functions import Top
import random


def RandomSongsFromTop(target: User, number: int):
    top = Top(target)["tracks"]

    # TODO: Make this a weighted version
    return random.sample(top, number)
