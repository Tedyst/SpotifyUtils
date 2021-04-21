package tracks_test

import (
	"testing"

	"github.com/tedyst/spotifyutils/tracks"
)

func TestGetTrack(t *testing.T) {
	tr := tracks.GetTrackFromID("track1")
	if tr.ID != 1 {
		t.Fail()
	}
}
