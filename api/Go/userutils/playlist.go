package userutils

import (
	"github.com/tedyst/spotifyutils/api/logging"
	"github.com/zmb3/spotify"
)

func (u *User) GetPlaylist(ID string) *spotify.FullPlaylist {
	items, err := u.Client.GetPlaylist(spotify.ID(ID))
	if err != nil {
		logging.ReportError("userutils.GetPlaylist()", err)
		return &spotify.FullPlaylist{}
	}

	// // Preloading the tracks in memory and updating them just in case they are used
	// go func(it []spotify.SimpleTrack) {
	// 	for _, s := range it {
	// 		t := tracks.RecentlyPlayedItemToTrack(s)
	// 		t.Update(u.Client)
	// 	}
	// }(items)

	return items
}
