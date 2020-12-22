package userutils

import (
	"github.com/tedyst/spotifyutils/config"
	"github.com/tedyst/spotifyutils/metrics"
)

func UpdateUserCount() {
	var usercount int64
	config.DB.Model(&User{}).Count(&usercount)
	metrics.UserCount.Set(float64(usercount))
}
