from flask import Blueprint
from flask_login import current_user

import SpotifyUtils.functions as functions
from SpotifyUtils.user import User
import SpotifyUtils.config as config

top_blueprint = Blueprint('top', __name__)


@top_blueprint.route('/me')
def me():
    if not current_user.is_authenticated:
        return {"success": False,
                "error": "Not authorized"}, 403
    result = functions.Top(current_user)

    return result


# I don't know why i made this function but ok
@top_blueprint.route('/<user>')
def user(user):
    if not current_user.is_authenticated:
        return {"success": False,
                "error": "Not authorized"}, 403
    if config.ADMIN != current_user.username:
        return {"success": False,
                "error": "Not authorized"}, 403
    user = User.query.filter(User.username == user).first()
    if user is None:
        return {
            "logged": True,
            "error": "User does not exist"
        }
    result = functions.Top(user)

    return result
