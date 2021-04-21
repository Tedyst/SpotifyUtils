package userutils

import (
	"os"
	"testing"

	"github.com/Tedyst/gormstore"
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

func setupTests() {
	var err error
	config.DB, err = gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})
	if err != nil {
		return
	}
	*config.MockExternalCalls = true
	config.DB.AutoMigrate(&tracks.Track{})
	config.DB.AutoMigrate(&User{})
	config.DB.AutoMigrate(&RecentTracks{})

	sessionOptions := gormstore.Options{
		TableName: "sessions",
	}
	config.SessionStore = gormstore.NewOptions(config.DB, sessionOptions, config.Secret)
	users := getTestUserData()
	for _, s := range users {
		s.Save()
	}
}

func TestGetUser(t *testing.T) {
	user := GetUser("user1")
	if user.ID != 1 {
		t.Fail()
	}
}
