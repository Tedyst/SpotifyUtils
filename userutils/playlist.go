package userutils

import (
	log "github.com/sirupsen/logrus"
	"github.com/tedyst/spotifyutils/tracks"
	"github.com/zmb3/spotify"
)

func (u *User) GetPlaylistTracks(ID string, cl spotify.Client) []*tracks.Track {
	var result []*tracks.Track
	items, err := u.Client().GetPlaylistTracks(spotify.ID(ID))
	if err != nil {
		log.Error(err)
		return []*tracks.Track{}
	}

	for page := 1; ; page++ {
		for _, s := range items.Tracks {
			result = append(result, tracks.GetTrackFromID(string(s.Track.ID)))
		}
		err = u.Client().NextPage(items)
		if err == spotify.ErrNoMorePages {
			break
		}
		if err != nil {
			log.Error(err)
		}
	}

	// Preloading the tracks in memory and updating them just in case they are used
	go func(it []*tracks.Track, cl spotify.Client) {
		for _, s := range it {
			t := tracks.GetTrackFromID(s.TrackID)
			t.Update(cl)
		}
	}(result, cl)

	return result
}
