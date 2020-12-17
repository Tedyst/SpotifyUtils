package main

import (
	"github.com/tedyst/spotifyutils/config"
	"github.com/tedyst/spotifyutils/tracks"
	"github.com/tedyst/spotifyutils/userutils"
	"gorm.io/gorm"
)

func initDB(db *gorm.DB) {
	db.AutoMigrate(&tracks.Track{})
	db.AutoMigrate(&userutils.User{})
	db.AutoMigrate(&userutils.RecentTracks{})

	users := []userutils.User{}
	config.DB.Model(&userutils.User{}).Where("settings_recent_tracks = ?", 1).Find(&users)
	for _, s := range users {
		s.StartRecentTracksUpdater()
	}
}
