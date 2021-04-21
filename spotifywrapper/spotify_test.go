package spotifywrapper_test

import (
	"testing"

	"github.com/tedyst/spotifyutils/config"
	"github.com/tedyst/spotifyutils/spotifywrapper"
)

func TestGetSpotifyURL(t *testing.T) {
	*config.SpotifyClientID = "clientid"
	*config.SpotifyClientSecret = "secret"
	s := spotifywrapper.GetSpotifyURL("http://localhost")
	if s != "https://accounts.spotify.com/authorize?client_id=clientid&redirect_uri=http%3A%2F%2Flocalhost%2Fauth&response_type=code&scope=user-library-read+playlist-read-private+playlist-read-collaborative+user-top-read+user-read-recently-played+user-read-private+playlist-modify-private+playlist-modify-public+user-follow-modify" {
		t.Errorf("got wrong url: %s", s)
	}
}
