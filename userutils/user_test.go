package userutils_test

import (
	"os"
	"testing"

	"github.com/Tedyst/gormstore"
	"github.com/tedyst/spotifyutils/config"
	"github.com/tedyst/spotifyutils/userutils"
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
	config.DB.AutoMigrate(&userutils.User{})

	sessionOptions := gormstore.Options{
		TableName: "sessions",
	}
	config.SessionStore = gormstore.NewOptions(config.DB, sessionOptions, config.Secret)
	users := getTestUserData()
	for _, s := range users {
		var inDB userutils.User
		config.DB.Where("id = ?", s.ID).FirstOrCreate(&inDB, s)
		inDB.Save()
	}
}

var valuesGetUser = []struct {
	UserID string
	ID     uint
}{
	{"user1", 1},
	{"user2", 2},
}

func TestGetUser(t *testing.T) {
	for _, tt := range valuesGetUser {
		t.Run(tt.UserID, func(t *testing.T) {
			s := userutils.GetUser(tt.UserID)
			if s.ID != tt.ID {
				t.Errorf("got %d, want %d", s.ID, tt.ID)
			}
		})
	}
}

var valuesGetUserFromCompareCode = []struct {
	ID          uint
	CompareCode string
}{
	{1, "AAAAAA"},
	{2, "BBBBBB"},
}

func TestGetUserFromCompareCode(t *testing.T) {
	for _, tt := range valuesGetUserFromCompareCode {
		t.Run(tt.CompareCode, func(t *testing.T) {
			s := userutils.GetUserFromCompareCode(tt.CompareCode)
			if s.ID != tt.ID {
				t.Errorf("got %d, want %d", s.ID, tt.ID)
			}
		})
	}
}
