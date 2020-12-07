package userutils

import (
	"database/sql"
	"log"
	"time"

	"github.com/tedyst/spotifyutils/api/config"
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
	items, err := u.Client.PlayerRecentlyPlayedOpt(options)
	if err != nil {
		logging.ReportError("userutils.UpdateRecentTracks()", err)
		return
	}
	for _, s := range items {
		t := tracks.SimpleConvertToTrack(s.Track)
		t.Update(u.Client)
	}

	u.insertRecentTracks(items)
}

func (u *User) insertRecentTracks(items []spotify.RecentlyPlayedItem) {
	var err error
	if len(items) == 0 {
		return
	}
	var rows *sql.Rows
	if len(items) == 1 {
		first := items[0].PlayedAt.Unix()
		rows, err = config.DB.Query("SELECT SongID,Time FROM listened WHERE Time == ? AND UserID = ?", first, u.ID)
		defer rows.Close()
	} else {
		first := items[0].PlayedAt.Unix()
		last := items[len(items)-1].PlayedAt.Unix()
		rows, err = config.DB.Query("SELECT SongID,Time FROM listened WHERE Time >= ? AND Time <= ? AND UserID = ?", last, first, u.ID)
		defer rows.Close()
	}
	if err != nil {
		logging.ReportError("userutils.UpdateRecentTracks()", err)
		return
	}
	defer rows.Close()
	for rows.Next() {
		var songID string
		var songTime int64
		err = rows.Scan(&songID, &songTime)
		for i, s := range items {
			if s.PlayedAt.Unix() == songTime {
				// Remove the i'th item from slice
				items[len(items)-1], items[i] = items[i], items[len(items)-1]
				items = items[:len(items)-1]
				break
			}
		}
	}
	tx, err := config.DB.Begin()
	if err != nil {
		logging.ReportError("userutils.UpdateRecentTracks()", err)
		return
	}
	for _, s := range items {
		_, err := tx.Exec("INSERT INTO listened (UserID, SongID, Time) VALUES (?, ?, ?)", u.ID, s.Track.ID, s.PlayedAt.Unix())
		if err != nil {
			logging.ReportError("userutils.UpdateRecentTracks()", err)
			return
		}
	}
	err = tx.Commit()
	if err != nil {
		logging.ReportError("userutils.UpdateRecentTracks()", err)
		return
	}
}

func (u *User) StartRecentTracksUpdater() {
	if u.RecentTracksTimer != nil {
		if u.Settings.RecentTracks == false {
			u.StopRecentTracksUpdater()
		}
		return
	}
	// Update once
	go u.UpdateRecentTracks()

	ticker := time.NewTicker(updateTimer)
	quit := make(chan struct{})
	u.RecentTracksTimer = &quit
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

func (u *User) StopRecentTracksUpdater() {
	if u.RecentTracksTimer == nil {
		return
	}
	close(*u.RecentTracksTimer)
	u.RecentTracksTimer = nil
}

func (u *User) GetRecentTracks() []spotify.RecentlyPlayedItem {
	options := &spotify.RecentlyPlayedOptions{Limit: 50}
	items, err := u.Client.PlayerRecentlyPlayedOpt(options)
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
			t := tracks.SimpleConvertToTrack(s.Track)
			t.Update(u.Client)
		}
	}(items)

	return items
}
