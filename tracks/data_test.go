package tracks_test

import (
	"os"
	"testing"
	"time"

	"github.com/tedyst/spotifyutils/config"
	"github.com/tedyst/spotifyutils/tracks"
	"github.com/wader/gormstore/v2"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func getTestTrackData() []tracks.Track {
	return []tracks.Track{
		{
			TrackID:     "track1",
			ID:          1,
			CreatedAt:   time.Now(),
			LastUpdated: time.Now(),
			Artists: []tracks.Artist{
				{
					ID:        1,
					CreatedAt: time.Now(),
					Name:      "artist1",
					ArtistID:  "artist1",
					Genres: tracks.GenresStruct{
						"genre1",
						"genre2",
					},
					Popularity: 1,
				},
				{
					ID:        2,
					CreatedAt: time.Now(),
					Name:      "artist2",
					ArtistID:  "artist2",
					Genres: tracks.GenresStruct{
						"genre2",
						"genre3",
					},
					Popularity: 1,
				},
			},
			Information: tracks.SpotifyInformation{
				TrackInformation: tracks.TrackInformationStruct{
					Popularity:    1,
					Length:        1000,
					Markets:       23,
					Explicit:      false,
					Key:           1,
					Mode:          1,
					Tempo:         1,
					TimeSignature: 1,
				},
				AlbumInformation: tracks.AlbumInformationStruct{
					Popularity:   1,
					ReleaseDate:  "2021",
					TracksAmount: 1,
					Markets:      23,
					ID:           "album1",
				},
				TrackFeatures: tracks.TrackFeaturesStruct{
					Acousticness:     1,
					Energy:           1,
					Instrumentalness: 1,
					Liveness:         1,
					Loudness:         1,
					Speechiness:      1,
				},
				Updated: true,
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
