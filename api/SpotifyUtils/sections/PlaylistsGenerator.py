from flask_login import current_user
from flask import Blueprint, request
from SpotifyUtils.functions.PlaylistGenerators.FriendsTop import FriendsTop
from SpotifyUtils.functions.PlaylistFunctions.SavePlaylist import SavePlaylist


playlist_generator_blueprint = Blueprint('playlist_generator', __name__)


@playlist_generator_blueprint.route('/friends')
def friends():
    if not current_user.is_authenticated:
        return {"success": False,
                "error": "Not authorized",
                "logged": False}, 403
    return {
        "success": True,
        "result": FriendsTop(current_user)
    }


@playlist_generator_blueprint.route('/save', methods=['POST'])
def save():
    if not current_user.is_authenticated:
        return {"success": False,
                "error": "Not authorized",
                "logged": False}, 403
    data = request.get_json()
    SavePlaylist(current_user, data["playlist"])
