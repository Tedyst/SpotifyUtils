package userutils

import (
	"flag"
	"log"
	"os"
	"testing"
	"time"

	"github.com/Tedyst/gormstore"
	"github.com/joho/godotenv"
	"github.com/tedyst/spotifyutils/config"
	"github.com/tedyst/spotifyutils/tracks"
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
	testuser.CompareCode = "AAAAAA"
	testuser.RefreshToken()
	testuser.RefreshUser()
	testuser.Save()
}

func TestGetUser(t *testing.T) {
	user := GetUser("vq0u2761le51p2idib6f89y78")
	if user.CompareCode == "" {
		t.Fail()
	}
	if user.UserID != "vq0u2761le51p2idib6f89y78" {
		t.Fail()
	}
}

func TestGetUserFromCompareCode(t *testing.T) {
	user := GetUserFromCompareCode("AAAAAA")
	if user.UserID != "vq0u2761le51p2idib6f89y78" {
		t.Fail()
	}
}

func TestClient(t *testing.T) {
	user := GetUser("vq0u2761le51p2idib6f89y78")
	client := user.Client()
	current, err := client.CurrentUser()
	if err != nil {
		t.FailNow()
	}
	if current.ID != user.UserID {
		t.Fail()
	}
}

func TestSave(t *testing.T) {
	user := GetUser("vq0u2761le51p2idib6f89y78")
	user.CompareCode = "BBBBBB"
	user.Save()
	user2 := GetUser("vq0u2761le51p2idib6f89y78")
	if user2.CompareCode != "BBBBBB" {
		t.Fail()
	}
	user2.CompareCode = "AAAAAA"
	user2.Save()
}

func TestRefresh(t *testing.T) {
	user := GetUser("vq0u2761le51p2idib6f89y78")
	user.DisplayName = ""
	user.Image = ""
	user.LastUpdated = time.Unix(0, 0)
	user.Save()
	user.RefreshUser()
	if user.DisplayName != "Tedy" {
		t.Fail()
	}
	if user.Image == "" {
		t.Fail()
	}
}

func TestFriends(t *testing.T) {
	user := GetUser("vq0u2761le51p2idib6f89y78")
	user.AddFriend(user)
	friends := user.GetFriends()
	if len(friends) != 1 {
		t.Fail()
	}
}
