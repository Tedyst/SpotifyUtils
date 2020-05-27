from flask import Blueprint
from flask_login import current_user
from SpotifyUtils.user import User
from SpotifyUtils.functions import Compare
from SpotifyUtils import db

compare_blueprint = Blueprint('compare', __name__)


@compare_blueprint.route('/<username>')
def user(username):
    if not current_user.is_authenticated:
        return {"logged": False}
    user = User.query.filter(User.username == username).first()
    if user is None:
        return {
            "logged": True,
            "success": False,
            "error": "User does not exist"
        }

    if user.id != current_user.id:
        current_user.friends.append(user)
        db.session.commit()
    return Compare(current_user, user)


@compare_blueprint.route('/')
def me():
    if not current_user.is_authenticated:
        return {"logged": False}

    result = {
        "logged": True,
        "code": current_user.friend_code,
        "friends": []
    }
    for friend in current_user.friends:
        result["friends"].append({
            "username": friend.username,
            "name": friend.name,
            "image": friend.image,
            "code": friend.friend_code
        })
    return result
