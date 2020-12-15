package userutils

import (
	"flag"
	"log"
	"os"
	"testing"

	"github.com/Tedyst/gormstore"
	"github.com/joho/godotenv"
	"github.com/tedyst/spotifyutils/api/config"
	"github.com/tedyst/spotifyutils/api/tracks"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func TestMain(m *testing.M) {
	setupTests()
	code := m.Run()
	os.Exit(code)
}

func lookupEnvOrString(key string, defaultVal string) string {
	if val, ok := os.LookupEnv(key); ok {
		return val
	}
	return defaultVal
}

func setupTests() {
	err := godotenv.Load("../.env")
	if err != nil {
		log.Panic()
	}
	flag.Parse()
	clientid := lookupEnvOrString("SPOTIFY_CLIENT_ID", "")
	clientsecret := lookupEnvOrString("SPOTIFY_CLIENT_SECRET", "")
	config.SpotifyClientID = &clientid
	config.SpotifyClientSecret = &clientsecret
	config.SpotifyAPI.SetAuthInfo(*config.SpotifyClientID, *config.SpotifyClientSecret)
	config.DB, err = gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})
	if err != nil {
		log.Panic()
	}
	config.DB.AutoMigrate(&tracks.Track{})
	config.DB.AutoMigrate(&User{})
	config.DB.AutoMigrate(&RecentTracks{})

	sessionOptions := gormstore.Options{
		TableName: "sessions",
	}
	config.SessionStore = gormstore.NewOptions(config.DB, sessionOptions, config.Secret)
	testuser := GetUser("vq0u2761le51p2idib6f89y78")
	testuser.Token.RefreshToken = lookupEnvOrString("USER_REFRESH_TOKEN", "")
	testuser.UserID = "vq0u2761le51p2idib6f89y78"
	testuser.RefreshToken()
	testuser.RefreshUser()
	testuser.Save()
}

func TestGetUser(t *testing.T) {
	var users []User
	config.DB.Find(&users)
	user := GetUser("vq0u2761le51p2idib6f89y78")
	if user.CompareCode == "" {
		t.Fail()
	}
	if user.UserID != "vq0u2761le51p2idib6f89y78" {
		t.Fail()
	}
}
