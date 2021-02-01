package main

import (
	"time"

	"github.com/tedyst/spotifyutils/config"
	"github.com/tedyst/spotifyutils/tracks"
	"github.com/tedyst/spotifyutils/userutils"
	"gorm.io/gorm"
)

const spreadStartupUsers = 30 * time.Minute // 30 minutes

func initDB(db *gorm.DB) {
	db.AutoMigrate(&tracks.Artist{})
	db.AutoMigrate(&tracks.Track{})
	db.AutoMigrate(&userutils.User{})
	db.AutoMigrate(&userutils.RecentTracks{})

	if *config.Debug == true {
		go func() {
			var usercount int64
			config.DB.Model(&userutils.User{}).Count(&usercount)

			users := []userutils.User{}
			config.DB.Model(&userutils.User{}).Where("settings_recent_tracks = ?", 1).Find(&users)

			if usercount == 0 {
				// Divide by 0 in the next line, you know the drill
				usercount = 1
			}
			sleep := time.Duration(int64(spreadStartupUsers) / usercount)
			for _, s := range users {
				s.StartRecentTracksUpdater()
				time.Sleep(sleep)
			}
		}()
	}

	userutils.UpdateUserCount()
}
