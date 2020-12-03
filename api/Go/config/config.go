package config

import (
	"database/sql"
	"flag"
	"os"

	"github.com/michaeljs1990/sqlitestore"
	"github.com/zmb3/spotify"
)

const SpotifyScope = "user-library-read playlist-read-private playlist-read-collaborative user-top-read user-read-recently-played user-read-private playlist-modify-private playlist-modify-public user-follow-modify"

var (
	Admin               = flag.String("Admin", "vq0u2761le51p2idib6f89y78", "User that can access specific pages")
	SpotifyClientID     = flag.String("SpotifyClientID", lookupEnvOrString("SPOTIFY_CLIENT_ID", ""), "The Spotify Client ID")
	SpotifyClientSecret = flag.String("SpotifyClientSecret", lookupEnvOrString("SPOTIFY_CLIENT_SECRET", ""), "The Spotify Client Secret")

	RedirectURL = flag.String("RedirectURL", "http://127.0.0.1:5000", "The Default Redirect URL")
	Address     = flag.String("Address", "0.0.0.0:5000", "The Default Address")
	Secret      = []byte(lookupEnvOrString("SECRET_KEY", "key"))

	SpotifyAPI = spotify.NewAuthenticator(*RedirectURL, SpotifyScope)

	Metrics = flag.Bool("Metrics", true, "Enable Metrics")

	DB           *sql.DB
	SessionStore *sqlitestore.SqliteStore
)

func lookupEnvOrString(key string, defaultVal string) string {
	if val, ok := os.LookupEnv(key); ok {
		return val
	}
	return defaultVal
}
