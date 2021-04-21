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
		CommonArtists: []userutils.TopArtist{},
		CommonTracks: []userutils.TopTrack{
			{
				Artist:   "artist1",
				Name:     "track1",
				ID:       "track1",
				Duration: 1000,
			},
		},
		CommonGenres: []string{
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
			if len(r1.CommonArtists) != len(tt.Result.CommonArtists) {
				t.Errorf("got %d artists, want %d", len(r1.CommonArtists), len(tt.Result.CommonArtists))
			}
			if len(r1.CommonTracks) != len(tt.Result.CommonTracks) {
				t.Errorf("got %d tracks, want %d", len(r1.CommonTracks), len(tt.Result.CommonTracks))
			}
			if r1.CommonTracks[0].ID != tt.Result.CommonTracks[0].ID {
				t.Errorf("got %s, want %s", r1.CommonTracks[0].ID, tt.Result.CommonTracks[0].ID)
			}
			if len(r1.CommonGenres) != len(tt.Result.CommonGenres) {
				t.Errorf("got %d genres, want %d", len(r1.CommonGenres), len(tt.Result.CommonGenres))
			}
			for i := range tt.Result.CommonGenres {
				if tt.Result.CommonGenres[i] != r1.CommonGenres[i] {
					t.Fail()
				}
			}
		})
	}
}
