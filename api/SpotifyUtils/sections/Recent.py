from flask import Blueprint
from flask_login import current_user

recent_blueprint = Blueprint('recent', __name__)


@recent_blueprint.route('/me')
def me():
    if not current_user.is_authenticated:
        return {"success": False,
                "error": "Not authorized"}, 403
    result = {
        "success": True,
        "results": []
    }

    for track in current_user.recent_tracks():
        result["results"].append(track.__json__())

    return result
