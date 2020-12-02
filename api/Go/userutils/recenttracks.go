package userutils

import (
	"database/sql"
	"log"
	"time"

	"github.com/tedyst/spotifyutils/api/config"
	"github.com/zmb3/spotify"
)

// UpdateRecentTracks updates the recent tracks
func (u *User) UpdateRecentTracks() {
	if u.Settings.RecentTracks == false {
		return
	}
	options := &spotify.RecentlyPlayedOptions{Limit: 50}
	items, err := u.Client.PlayerRecentlyPlayedOpt(options)
	if err != nil {
		log.Print(err)
		return
	}
	if len(items) == 0 {
		return
	}
	var rows *sql.Rows
	if len(items) == 1 {
		first := items[0].PlayedAt.Unix()
		rows, err = config.DB.Query("SELECT SongID,Time FROM listened WHERE Time == ? AND UserID = ?", first, u.ID)
	} else {
		first := items[0].PlayedAt.Unix()
		last := items[len(items)-1].PlayedAt.Unix()
		rows, err = config.DB.Query("SELECT SongID,Time FROM listened WHERE Time >= ? AND Time <= ? AND UserID = ?", last, first, u.ID)
	}
	if err != nil {
		log.Print(err)
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
		log.Print(err)
		return
	}
	for _, s := range items {
		_, err := tx.Exec("INSERT INTO listened (UserID, SongID, Time) VALUES (?, ?, ?)", u.ID, s.Track.ID, s.PlayedAt.Unix())
		if err != nil {
			log.Print(err)
			return
		}
	}
	err = tx.Commit()
	if err != nil {
		log.Print(err)
		return
	}
}

func (u *User) StartRecentTracksUpdater() {
	if u.RecentTracksTimer != nil {
		return
	}
	ticker := time.NewTicker(1 * time.Hour)
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
}
