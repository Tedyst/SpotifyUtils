package config

import (
	"flag"
	"fmt"
	"os"

	"gorm.io/gorm"

	"github.com/gabyshev/genius-api/genius"
	"github.com/wader/gormstore/v2"
	"github.com/zmb3/spotify"
)

const SpotifyScope = "user-library-read playlist-read-private playlist-read-collaborative user-top-read user-read-recently-played user-read-private playlist-modify-private playlist-modify-public user-follow-modify"

var (
	BuildPath = flag.String("BuildPath", "frontend/build", "The Path where is the React app stored")

	MockExternalCalls = flag.Bool("MockExternalCalls", false, "Disable calling the Spotify or Genius API and only use information from DB")
	MockUser          = flag.String("MockUser", "", "The User to login as when using MockExternalCalls")

	SpotifyClientID     = flag.String("SpotifyClientID", lookupEnvOrString("SPOTIFY_CLIENT_ID", ""), "The Spotify Client ID")
	SpotifyClientSecret = flag.String("SpotifyClientSecret", lookupEnvOrString("SPOTIFY_CLIENT_SECRET", ""), "The Spotify Client Secret")

	BaseURL = flag.String("RedirectURL", "https://spotify.stoicatedy.ovh", "The Base App URL")
	Address = flag.String("Address", "0.0.0.0:5000", "The Default Address")
	Secret  = []byte(lookupEnvOrString("SECRET_KEY", "key"))

	Database = flag.String("Database", lookupEnvOrString("DATABASE", "sqlite://data.db"), "The MySQL Database Address")

	IsMySQL = false

	SpotifyAPI = spotify.NewAuthenticator(fmt.Sprintf("%s/auth", *BaseURL), SpotifyScope)

	Metrics = flag.Bool("Metrics", true, "Enable Metrics")

	DB           *gorm.DB
	SessionStore *gormstore.Store
	GeniusToken  = flag.String("GeniusToken", lookupEnvOrString("GENIUS_TOKEN", ""), "The Genius Client Token")
	GeniusClient = genius.NewClient(nil, *GeniusToken)

	DiscordBotToken = flag.String("DiscordBotToken", lookupEnvOrString("DISCORD_TOKEN", ""), "The Discord Bot Token")

	Debug = flag.Bool("Debug", false, "Debug mode")
)

func lookupEnvOrString(key string, defaultVal string) string {
	if val, ok := os.LookupEnv(key); ok {
		return val
	}
	return defaultVal
}
