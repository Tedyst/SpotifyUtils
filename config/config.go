package config

import (
	"flag"
	"os"

	"gorm.io/gorm"

	"github.com/Tedyst/gormstore"
	"github.com/gabyshev/genius-api/genius"
	"github.com/zmb3/spotify"
)

const SpotifyScope = "user-library-read playlist-read-private playlist-read-collaborative user-top-read user-read-recently-played user-read-private playlist-modify-private playlist-modify-public user-follow-modify"

var (
	BuildPath = flag.String("BuildPath", "frontend/build", "The Path where is the react app stored")

	SpotifyClientID     = flag.String("SpotifyClientID", lookupEnvOrString("SPOTIFY_CLIENT_ID", ""), "The Spotify Client ID")
	SpotifyClientSecret = flag.String("SpotifyClientSecret", lookupEnvOrString("SPOTIFY_CLIENT_SECRET", ""), "The Spotify Client Secret")

	RedirectURL = flag.String("RedirectURL", "https://testing.stoicatedy.ovh/auth", "The Default Redirect URL")
	Address     = flag.String("Address", "0.0.0.0:5000", "The Default Address")
	Secret      = []byte(lookupEnvOrString("SECRET_KEY", "key"))

	SpotifyAPI = spotify.NewAuthenticator(*RedirectURL, SpotifyScope)

	Metrics = flag.Bool("Metrics", true, "Enable Metrics")

	DB           *gorm.DB
	SessionStore *gormstore.Store
	GeniusToken  = flag.String("GeniusToken", lookupEnvOrString("GENIUS_TOKEN", ""), "The Genius Client Token")
	GeniusClient = genius.NewClient(nil, *GeniusToken)

	Debug = flag.Bool("Debug", false, "Debug mode")
)

func lookupEnvOrString(key string, defaultVal string) string {
	if val, ok := os.LookupEnv(key); ok {
		return val
	}
	return defaultVal
}
