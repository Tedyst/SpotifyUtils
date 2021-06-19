package userutils

import (
	log "github.com/sirupsen/logrus"
	"github.com/tedyst/spotifyutils/config"
	"github.com/tedyst/spotifyutils/metrics"
	"github.com/tedyst/spotifyutils/tracks"
	"github.com/zmb3/spotify"
)

func (u *User) GetPlaylistTracks(ID string, cl spotify.Client) []*tracks.Track {
	if *config.MockExternalCalls {
		return []*tracks.Track{}
	}
	var result []*tracks.Track
	metrics.SpotifyRequests.Add(1)
	items, err := u.Client().GetPlaylistTracks(spotify.ID(ID))
	if err != nil {
		log.Error(err)
		return []*tracks.Track{}
	}

	for page := 1; ; page++ {
		for _, s := range items.Tracks {
			result = append(result, tracks.GetTrackFromID(string(s.Track.ID)))
		}
		metrics.SpotifyRequests.Add(1)
		err = u.Client().NextPage(items)
		if err == spotify.ErrNoMorePages {
			break
		}
		if err != nil {
			log.Error(err)
		}
	}

	tracks.BatchUpdate(result, cl)

	return result
}
