package userutils_test

import (
	"os"
	"testing"
	"time"

	"github.com/Tedyst/gormstore"
	"github.com/tedyst/spotifyutils/config"
	"github.com/tedyst/spotifyutils/userutils"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func getTestUserData() []userutils.User {
	return []userutils.User{
		{
			Model: gorm.Model{
				ID:        1,
				CreatedAt: time.Now(),
				UpdatedAt: time.Now(),
			},
			UserID: "user1",
			Playlists: userutils.PlaylistsStruct{
				{
					ID:   "playlist1",
					Name: "Playlist 1",
				},
				{
					ID:   "playlist2",
					Name: "Playlist 2",
				},
			},
			CompareCode: "AAAAAA",
			Friends: userutils.FriendsStruct{
				"user2",
			},
			Top: userutils.TopStruct{
				Genres: userutils.GenresStruct{
					"genre1",
					"genre2",
					"genre3",
				},
				Updated: time.Now().UTC().Unix(),
				Artists: userutils.ArtistsStruct{
					userutils.TopArtist{
						Name: "Artist1",
						ID:   "artist1",
					},
				},
				Tracks: userutils.TracksStruct{
					userutils.TopTrack{
						Artist:   "artist1",
						Name:     "track1",
						ID:       "track1",
						Duration: 1000,
					},
				},
			},
			LastUpdated: time.Now(),
		},
		{
			Model: gorm.Model{
				ID:        2,
				CreatedAt: time.Now(),
				UpdatedAt: time.Now(),
			},
			UserID: "user2",
			Playlists: userutils.PlaylistsStruct{
				{
					ID:   "playlist2",
					Name: "Playlist 2",
				},
				{
					ID:   "playlist3",
					Name: "Playlist 3",
				},
			},
			CompareCode: "BBBBBB",
			Friends: userutils.FriendsStruct{
				"user1",
			},
			Top: userutils.TopStruct{
				Genres: userutils.GenresStruct{
					"genre1",
					"genre2",
					"genre4",
				},
				Updated: time.Now().UTC().Unix(),
				Artists: userutils.ArtistsStruct{
					userutils.TopArtist{
						Name: "Artist2",
						ID:   "artist2",
					},
				},
				Tracks: userutils.TracksStruct{
					userutils.TopTrack{
						Artist:   "artist1",
						Name:     "track1",
						ID:       "track1",
						Duration: 1000,
					},
				},
			},
			LastUpdated: time.Now(),
		},
	}
}

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
