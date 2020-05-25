import spotipy
from flask import request

import SpotifyUtils.config as config
from SpotifyUtils import APP, db
from SpotifyUtils.user import User
from SpotifyUtils.utils import real_url
from flask_login import login_user, current_user
from SpotifyUtils.sections.PlaylistSearcher import playlistsearcher_blueprint
from SpotifyUtils.sections.Lyrics import lyrics_blueprint
from SpotifyUtils.sections.Top import top_blueprint
from SpotifyUtils.sections.Compare import compare_blueprint
import json

db.create_all()


@APP.route('/auth')
def auth():
    sp_oauth = spotipy.oauth2.SpotifyOAuth(
        config.SPOTIFY_CLIENT_ID,
        config.SPOTIFY_CLIENT_SECRET,
        real_url(),
        scope=config.SCOPE)

    code = sp_oauth.parse_response_code(request.url)
    if "?code=" in request.url:
        APP.logger.info(
            "Found Spotify auth code in Request URL!")
        APP.logger.debug("Spotify auth code is %s", code)

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
    db.session.add(user)
    db.session.commit()
    login_user(user)
    pint = []
    for playlistasd in user.playlists():
        pint.append(playlistasd.id)
    APP.logger.info("Playlists for %s: %s",
                    user.username, json.dumps(pint))
    return {"success": True}


@APP.route('/status')
def status():
    if not current_user.is_authenticated:
        return {"logged": False}
    return {
        "logged": True,
        "username": current_user.name,
        "image": current_user.image,
        "playlists": current_user.playlists_json()
    }


@APP.route('/playlists')
def playlists():
    if not current_user.is_authenticated:
        return {"logged": False}
    return {
        "logged": True,
        "playlists": current_user.playlists_json()
    }


@APP.route('/auth-url')
def authurl():
    sp_oauth = spotipy.oauth2.SpotifyOAuth(
        config.SPOTIFY_CLIENT_ID,
        config.SPOTIFY_CLIENT_SECRET,
        real_url(),
        scope=config.SCOPE)

    url = sp_oauth.get_authorize_url()
    return {"url": url}


APP.register_blueprint(playlistsearcher_blueprint,
                       url_prefix="/playlistsearch")
APP.register_blueprint(lyrics_blueprint,
                       url_prefix="/lyrics")
APP.register_blueprint(top_blueprint,
                       url_prefix="/top")
APP.register_blueprint(compare_blueprint,
                       url_prefix="/compare")


if __name__ == "__main__":
    APP.run(threaded=True, debug=True)
