from SpotifyUtils import APP


def real_url():
    if APP.env == "development":
        return "http://localhost:3000/auth"
    return "https://spotify.stoicatedy.ovh/auth"
