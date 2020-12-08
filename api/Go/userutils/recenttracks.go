package userutils

import (
	"log"
	"time"

	"github.com/tedyst/spotifyutils/api/logging"
	"github.com/tedyst/spotifyutils/api/tracks"
	"github.com/zmb3/spotify"
)

const updateTimer = 2 * time.Hour

// UpdateRecentTracks updates the recent tracks
func (u *User) UpdateRecentTracks() {
	if u.Settings.RecentTracks == false {
		return
	}
	log.Printf("Updating recent tracks for %s", u.ID)
	options := &spotify.RecentlyPlayedOptions{Limit: 50}
	items, err := u.Client().PlayerRecentlyPlayedOpt(options)
	if err != nil {
		logging.ReportError("userutils.UpdateRecentTracks()", err)
		return
	}
	for _, s := range items {
		t := tracks.RecentlyPlayedItemToTrack(s.Track)
		t.Update(*u.Client())
	}

	u.insertRecentTracks(items)
}

func (u *User) insertRecentTracks(items []spotify.RecentlyPlayedItem) {

}

func (u *User) StartRecentTracksUpdater() {
	_, timer := searchTimers(u.UserID)
	if timer.Lock != nil {
		if u.Settings.RecentTracks == false {
			u.StopRecentTracksUpdater()
		}
		return
	}
	// Update once
	go u.UpdateRecentTracks()

	ticker := time.NewTicker(updateTimer)
	quit := make(chan struct{})
	timer.Lock = &quit
	go func(u *User) {
		for {
			select {
			case <-ticker.C:
				u.UpdateRecentTracks()
			case <-quit:
				ticker.Stop()
				return
			}
		}
	}(u)
}

type RecentTracksTimerStruct struct {
	UserID string
	Lock   *chan struct{}
}

var recentTrackTimerCache []*RecentTracksTimerStruct

func searchTimers(UserID string) (int, *RecentTracksTimerStruct) {
	for i, s := range recentTrackTimerCache {
		if s.UserID == UserID {
			return i, s
		}
	}
	result := &RecentTracksTimerStruct{
		UserID: UserID,
	}
	recentTrackTimerCache = append(recentTrackTimerCache, result)
	return len(recentTrackTimerCache) - 1, result
}

func (u *User) StopRecentTracksUpdater() {
	index, timer := searchTimers(u.UserID)
	if timer.Lock == nil {
		return
	}
	close(*timer.Lock)
	recentTrackTimerCache[index] = recentTrackTimerCache[len(recentTrackTimerCache)-1]
	recentTrackTimerCache[len(recentTrackTimerCache)-1] = nil
	recentTrackTimerCache = recentTrackTimerCache[:len(recentTrackTimerCache)-1]
}

func (u *User) GetRecentTracks() []spotify.RecentlyPlayedItem {
	options := &spotify.RecentlyPlayedOptions{Limit: 50}
	items, err := u.Client().PlayerRecentlyPlayedOpt(options)
	if err != nil {
		logging.ReportError("userutils.UpdateRecentTracks()", err)
		return []spotify.RecentlyPlayedItem{}
	}
	if u.Settings.RecentTracks == true {
		u.insertRecentTracks(items)
	}

	// Preloading the tracks in memory and updating them just in case they are used
	go func(it []spotify.RecentlyPlayedItem) {
		for _, s := range it {
			t := tracks.RecentlyPlayedItemToTrack(s.Track)
			t.Update(*u.Client())
		}
	}(items)

	return items
}
