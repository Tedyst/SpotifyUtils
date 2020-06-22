from flask_login import current_user
from flask import Blueprint, request
from SpotifyUtils.functions.PlaylistGenerators.FriendsTop import FriendsTop
from SpotifyUtils.functions.PlaylistGenerators.Copy import Copy
from SpotifyUtils.functions.PlaylistFunctions.SavePlaylist import SavePlaylist


playlist_generator_blueprint = Blueprint('playlist_generator', __name__)


@playlist_generator_blueprint.route('/friends')
def friends():
    if not current_user.is_authenticated:
        return {"success": False,
                "error": "Not authorized",
                "logged": False}, 403
    friends_top = FriendsTop(current_user)
    tracks = []
    for track in friends_top:
        tracks.append(track["song"]["id"].replace("spotify:track:", ""))
    return {
        "success": True,
        "result": friends_top,
        "playlist": tracks
    }


@playlist_generator_blueprint.route('/copy/<origin>/<target>')
def playlist(origin, target):
    if not current_user.is_authenticated:
        return {"success": False,
                "error": "Not authorized",
                "logged": False}, 403
    return {
        "success": True,
        "result": Copy(current_user, origin, target),
        "playlist": []
    }


@playlist_generator_blueprint.route('/save', methods=['POST'])
def save():
    if not current_user.is_authenticated:
        return {"success": False,
                "error": "Not authorized",
                "logged": False}, 403
    data = request.get_json()
    return {
        "success": True,
        "playlist_id": SavePlaylist(current_user, data["playlist"])
    }
