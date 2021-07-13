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

func TestArtistString(t *testing.T) {
	tr := tracks.GetTrackFromID("track1")
	expected := "artist1, artist2"
	s := tr.ArtistString()
	if s != expected {
		t.Errorf("expected %s, got %s", expected, s)
	}
}

//TestTrackMutex is a test for the mutex
func TestTrackMutex(t *testing.T) {
	tr := tracks.GetTrackFromID("track1")
	tr.Mutex.Lock()
	defer tr.Mutex.Unlock()
}
