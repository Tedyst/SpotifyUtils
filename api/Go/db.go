package main

import (
	"github.com/tedyst/spotifyutils/api/tracks"
	"gorm.io/gorm"
)

func initDB(db *gorm.DB) {
	db.AutoMigrate(&tracks.Track{})
}
