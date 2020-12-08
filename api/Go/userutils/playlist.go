package userutils

import (
	"github.com/tedyst/spotifyutils/api/logging"
	"github.com/tedyst/spotifyutils/api/tracks"
	"github.com/zmb3/spotify"
)

func (u *User) GetPlaylist(ID string) []spotify.SimpleTrack {
	items, err := u.Client.GetPlaylist(spotify.ID(ID))
	if err != nil {
		logging.ReportError("userutils.GetPlaylist()", err)
		return []spotify.SimpleTrack{}
	}

	// Preloading the tracks in memory and updating them just in case they are used
	go func(it []spotify.SimpleTrack) {
		for _, s := range it {
			t := tracks.RecentlyPlayedItemToTrack(s.Track)
			t.Update(u.Client)
		}
	}(items)

	return items
}
