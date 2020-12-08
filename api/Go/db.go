package main

import (
	"github.com/tedyst/spotifyutils/api/tracks"
	"github.com/tedyst/spotifyutils/api/userutils"
	"gorm.io/gorm"
)

func initDB(db *gorm.DB) {
	db.AutoMigrate(&tracks.Track{})
	db.AutoMigrate(&userutils.User{})
}
