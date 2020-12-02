package userutils

import (
	"log"

	"github.com/tedyst/spotifyutils/api/config"
	"golang.org/x/oauth2"
)

func DeleteAllTokens() {
	_, err := config.DB.Exec("UPDATE users SET Token = '', RefreshToken = ''")
	if err != nil {
		log.Println(err)
	}
	for _, s := range usersCache {
		s.Token = new(oauth2.Token)
	}
}
