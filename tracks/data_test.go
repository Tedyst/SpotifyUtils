package tracks_test

import (
	"time"

	"github.com/tedyst/spotifyutils/tracks"
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
