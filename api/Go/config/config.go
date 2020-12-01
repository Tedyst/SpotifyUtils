package config

import (
	"database/sql"

	"github.com/michaeljs1990/sqlitestore"
	"github.com/zmb3/spotify"
)

var (
	SpotifyScope        = "user-library-read playlist-read-private playlist-read-collaborative user-top-read user-read-recently-played user-read-private playlist-modify-private playlist-modify-public user-follow-modify"
	Admin               = "vq0u2761le51p2idib6f89y78"
	RedirectURL         = "http://127.0.0.1"
	SpotifyClientID     = "d4dc2e6f181346f49ef1a1214b4732b3"
	SpotifyClientSecret = "d50a2fe6f9b6401faa267a2d258f84d7"
	Address             = "0.0.0.0:5000"
	Secret              = []byte("ePAPW9vJv7gHoftvQTyNj5VkWB52mlza")
	SpotifyAPI          = spotify.NewAuthenticator(RedirectURL, SpotifyScope)
	DB                  *sql.DB
	SessionStore        *sqlitestore.SqliteStore
)
