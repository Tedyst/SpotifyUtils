import spotipy
from flask import request, send_from_directory

import SpotifyUtils.config as config
from SpotifyUtils import APP, db
from SpotifyUtils.user import User
from flask_login import login_user, current_user
from SpotifyUtils.sections.PlaylistSearcher import playlistsearcher_blueprint
from SpotifyUtils.sections.Lyrics import lyrics_blueprint
from SpotifyUtils.sections.Top import top_blueprint
from SpotifyUtils.sections.Compare import compare_blueprint
from SpotifyUtils.sections.Friends import friends_blueprint
from SpotifyUtils.sections.Track import track_blueprint
import time

db.create_all()


@APP.route('/api/auth', methods=['POST'])
def auth():
    data = request.get_json()
    if data is None:
        return {"success": False}
    if "host" not in data:
        return {"success": False}
    if "code" not in data:
        return {"success": False}
    sp_oauth = spotipy.oauth2.SpotifyOAuth(
        config.SPOTIFY_CLIENT_ID,
        config.SPOTIFY_CLIENT_SECRET,
        data["host"] + "/auth",
        scope=config.SCOPE)

    code = data["code"]

    try:
        token_info = sp_oauth.get_access_token(code, check_cache=False)
    except spotipy.oauth2.SpotifyOauthError as err:
        APP.logger.debug(err)
        return {"success": False}

    token = token_info['access_token']
    me = spotipy.Spotify(token).me()
    username = me['id']

    user = User.query.filter(User.username == username).first()
    if user is None:
        user = User(username, token)
        if me['display_name']:
            user.displayname = me['display_name']
        if len(me['images']) > 0:
            user.image = me['images'][0]['url']

    user.token = token
    user.last_updated = time.time()
    db.session.add(user)
    db.session.commit()
    login_user(user)
    APP.logger.debug("Playlists for %s: %s",
                     user.username, user.playlists_json())
    return {"success": True}


@APP.route('/api/status')
def status():
    if not current_user.is_authenticated():
        return {"logged": False}
    if not current_user.valid():
        return {"logged": False}
    return {
        "logged": True,
        "username": current_user.name,
        "image": current_user.image,
        "playlists": current_user.playlists_json()
    }


@APP.route('/api/playlists')
def playlists():
    if not current_user.is_authenticated():
        return {"logged": False}
    return {
        "logged": True,
        "playlists": current_user.playlists_json()
    }


@APP.route('/api/auth-url', methods=['POST'])
def authurl():
    data = request.get_json()
    if data is None:
        return {"url": ""}
    if "host" not in data:
        return {"url": ""}
    sp_oauth = spotipy.oauth2.SpotifyOAuth(
        config.SPOTIFY_CLIENT_ID,
        config.SPOTIFY_CLIENT_SECRET,
        data["host"] + "/auth",
        scope=config.SCOPE)

    url = sp_oauth.get_authorize_url()
    return {"url": url}


APP.register_blueprint(playlistsearcher_blueprint,
                       url_prefix="/api/playlistsearch")
APP.register_blueprint(lyrics_blueprint,
                       url_prefix="/api/lyrics")
APP.register_blueprint(top_blueprint,
                       url_prefix="/api/top")
APP.register_blueprint(compare_blueprint,
                       url_prefix="/api/compare")
APP.register_blueprint(friends_blueprint,
                       url_prefix="/api/friends")
APP.register_blueprint(track_blueprint,
                       url_prefix="/api/track")


@APP.route('/', defaults={'path': ''})
@APP.route('/<path:path>')
def catch_all(path, **options):
    try:
        asd = send_from_directory('../../build', path)
    except Exception:
        asd = send_from_directory('../../build', 'index.html')
    return asd


if __name__ == "__main__":
    APP.run(threaded=True, debug=True)
