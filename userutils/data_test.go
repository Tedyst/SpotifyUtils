package userutils

import (
	"time"

	"gorm.io/gorm"
)

func getTestUserData() []User {
	return []User{
		{
			Model: gorm.Model{
				ID:        1,
				CreatedAt: time.Now(),
				UpdatedAt: time.Now(),
			},
			UserID: "user1",
			Playlists: PlaylistsStruct{
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
			Friends: FriendsStruct{
				"user2",
			},
			Top: TopStruct{
				Genres: GenresStruct{
					"genre1",
					"genre2",
					"genre3",
				},
				Updated: time.Now().UTC().Unix(),
				Artists: ArtistsStruct{
					TopArtist{
						Name: "Artist1",
						ID:   "artist1",
					},
				},
				Tracks: TracksStruct{
					TopTrack{
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
			Playlists: PlaylistsStruct{
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
			Friends: FriendsStruct{
				"user1",
			},
			Top: TopStruct{
				Genres: GenresStruct{
					"genre1",
					"genre2",
					"genre4",
				},
				Updated: time.Now().UTC().Unix(),
				Artists: ArtistsStruct{
					TopArtist{
						Name: "Artist2",
						ID:   "artist2",
					},
				},
				Tracks: TracksStruct{
					TopTrack{
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
