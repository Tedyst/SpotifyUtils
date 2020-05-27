from flask import Blueprint
from flask_login import current_user

friends_blueprint = Blueprint('friends', __name__)


@friends_blueprint.route('/')
def friends():
    if not current_user.is_authenticated:
        return {"logged": False}

    result = {
        "logged": True,
        "friends": []
    }
    for friend in current_user.friends:
        result["friends"].append({
            "username": friend.username,
            "name": friend.name,
            "image": friend.image
        })
    return result
