package userutils_test

import (
	"fmt"
	"testing"

	"github.com/tedyst/spotifyutils/userutils"
)

var valuesCompare = []struct {
	UserID1 string
	UserID2 string
	Result  userutils.CompareStruct
}{
	{"user1", "user2", userutils.CompareStruct{
		Artists: []userutils.TopArtist{},
		Tracks: []userutils.TopTrack{
			{
				Artist:   "artist1",
				Name:     "track1",
				ID:       "track1",
				Duration: 1000,
			},
		},
		Genres: []string{
			"genre1",
			"genre2",
		},
		Score: 100,
	}},
}

func TestCompare(t *testing.T) {
	for _, tt := range valuesCompare {
		t.Run(fmt.Sprintf("%s-%s", tt.UserID1, tt.UserID2), func(t *testing.T) {
			user1 := userutils.GetUser(tt.UserID1)
			user2 := userutils.GetUser(tt.UserID2)
			r1 := user1.Compare(user2)
			if r1.Score != tt.Result.Score {
				t.Errorf("got %f, want %f", r1.Score, tt.Result.Score)
			}
			if len(r1.Artists) != len(tt.Result.Artists) {
				t.Errorf("got %d artists, want %d", len(r1.Artists), len(tt.Result.Artists))
			}
			if len(r1.Tracks) != len(tt.Result.Tracks) {
				t.Errorf("got %d tracks, want %d", len(r1.Tracks), len(tt.Result.Tracks))
			}
			if r1.Tracks[0].ID != tt.Result.Tracks[0].ID {
				t.Errorf("got %s, want %s", r1.Tracks[0].ID, tt.Result.Tracks[0].ID)
			}
			if len(r1.Genres) != len(tt.Result.Genres) {
				t.Errorf("got %d genres, want %d", len(r1.Genres), len(tt.Result.Genres))
			}
			for i := range tt.Result.Genres {
				if tt.Result.Genres[i] != r1.Genres[i] {
					t.Fail()
				}
			}
		})
	}
}
