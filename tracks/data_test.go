package tracks_test

import (
	"os"
	"testing"
	"time"

	"github.com/Tedyst/gormstore"
	"github.com/tedyst/spotifyutils/config"
	"github.com/tedyst/spotifyutils/tracks"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func getTestTrackData() []tracks.Track {
	return []tracks.Track{
		{
			TrackID: "track1",
			Model: gorm.Model{
				ID:        1,
				CreatedAt: time.Now(),
				UpdatedAt: time.Now(),
			},
			LastUpdated: time.Now(),
			Artists: []tracks.Artist{
				{
					Model: gorm.Model{
						ID:        1,
						CreatedAt: time.Now(),
						UpdatedAt: time.Now(),
					},
					Name:     "artist1",
					ArtistID: "artist1",
					Genres: tracks.GenresStruct{
						"genre1",
						"genre2",
					},
					Popularity: 1,
				},
				{
					Model: gorm.Model{
						ID:        2,
						CreatedAt: time.Now(),
						UpdatedAt: time.Now(),
					},
					Name:     "artist2",
					ArtistID: "artist2",
					Genres: tracks.GenresStruct{
						"genre2",
						"genre3",
					},
					Popularity: 1,
				},
			},
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
	config.DB.AutoMigrate(&tracks.Track{})

	sessionOptions := gormstore.Options{
		TableName: "sessions",
	}
	config.SessionStore = gormstore.NewOptions(config.DB, sessionOptions, config.Secret)

	tr := getTestTrackData()
	for _, s := range tr {
		s.Save()
	}

}
