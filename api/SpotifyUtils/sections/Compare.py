from flask import Blueprint
from flask_login import current_user
from SpotifyUtils.user import User
from SpotifyUtils.functions import Compare

compare_blueprint = Blueprint('compare', __name__)


@compare_blueprint.route('/<user>')
def user(user):
    if not current_user.is_authenticated:
        return {"logged": False}
    user = User.query.filter(User.username == user).first()
    if user is None:
        return {
            "logged": True,
            "success": False,
            "error": "User does not exist"
        }
    return Compare(current_user, user)
