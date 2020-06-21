import spotipy
from flask import request, send_from_directory, redirect, url_for

import SpotifyUtils.config as config
from SpotifyUtils import APP, db
from SpotifyUtils.user import User
from flask_login import login_user, current_user, logout_user
from SpotifyUtils.sections.PlaylistSearcher import playlistsearcher_blueprint
from SpotifyUtils.sections.Lyrics import lyrics_blueprint
from SpotifyUtils.sections.Top import top_blueprint
from SpotifyUtils.sections.Compare import compare_blueprint
from SpotifyUtils.sections.Friends import friends_blueprint
from SpotifyUtils.sections.Track import track_blueprint
from SpotifyUtils.sections.Recent import recent_blueprint
from SpotifyUtils.sections.PlaylistsGenerator import playlist_generator_blueprint
import time

db.create_all()


@APP.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('catch_all', path="/"))


@APP.route('/api/auth', methods=['POST'])
def auth():
    data = request.get_json()
    if data is None:
        return {"success": False,
                "error": "Invalid request"}, 400
    if "host" not in data:
        return {"success": False,
                "error": "Invalid request"}, 400
    if "code" not in data:
        return {"success": False,
                "error": "Invalid request"}, 400
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
        return {"success": False,
                "error": "Code invalid"}, 400

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
    user.refresh_token = token_info["refresh_token"]
    user.last_updated = time.time()
    db.session.add(user)
    db.session.commit()
    login_user(user)
    APP.logger.debug("Playlists for %s: %s",
                     user.username, user.playlists_json())
    return {"success": True}


@APP.route('/api/status')
def status():
    if not current_user.is_authenticated:
        return {
            "success": False,
            "error": "Not authorized",
            "username": "",
            "image": "",
            "playlists": [],
            "logged": False
        }, 403
    if not current_user.valid():
        return {
            "success": False,
            "error": "Not authorized",
            "username": "",
            "image": "",
            "playlists": [],
            "logged": False
        }, 403
    return {
        "success": True,
        "logged": True,
        "username": current_user.name,
        "image": current_user.image,
        "playlists": current_user.playlists_json()
    }


@APP.route('/api/playlists')
def playlists():
    if not current_user.is_authenticated:
        return {"success": False,
                "error": "Not authorized"}, 403
    return {
        "playlists": current_user.playlists_json()
    }


@APP.route('/api/auth-url', methods=['POST'])
def authurl():
    data = request.get_json()
    if data is None:
        return {"success": False,
                "error": "Invalid Request",
                "url": ""}, 400
    if "host" not in data:
        return {"success": False,
                "error": "Invalid Request",
                "url": ""}, 400
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
APP.register_blueprint(recent_blueprint,
                       url_prefix="/api/recent")
APP.register_blueprint(playlist_generator_blueprint,
                       url_prefix="/api/playlists_generator")


@APP.route('/', defaults={'path': ''})
@APP.route('/<path:path>')
def catch_all(path, **options):
    try:
        asd = send_from_directory('../../build', path)
    except Exception:
        asd = send_from_directory('../../build', 'index.html')
    return asd


@APP.cli.command()
def invalidate_all_tokens():
    db.session.query(User).update({
        User.token: None,
        User.refresh_token: None
    })
    db.session.commit()


if __name__ == "__main__":
    APP.run(threaded=True, debug=True)
