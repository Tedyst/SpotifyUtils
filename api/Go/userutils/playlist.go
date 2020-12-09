package userutils

import (
	log "github.com/sirupsen/logrus"
	"github.com/zmb3/spotify"
)

func (u *User) GetPlaylist(ID string) *spotify.FullPlaylist {
	items, err := u.Client().GetPlaylist(spotify.ID(ID))
	if err != nil {
		log.Error(err)
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
