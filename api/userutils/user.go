package userutils

import (
	"errors"
	"time"

	log "github.com/sirupsen/logrus"
	"github.com/tedyst/spotifyutils/api/config"
	"github.com/zmb3/spotify"
	"golang.org/x/oauth2"

	"gorm.io/gorm"
)

// User is the main user struct
type User struct {
	gorm.Model
	UserID      string `gorm:"unique"`
	DisplayName string
	Token       *oauth2.Token `gorm:"embedded;embeddedPrefix:token_"`
	Image       string
	Playlists   PlaylistsStruct
	LastUpdated time.Time
	Settings    UserSettings `gorm:"embedded;embeddedPrefix:settings_"`
	Top         TopStruct    `gorm:"embedded;embeddedPrefix:top_"`
	CompareCode string       `gorm:"unique"`
	Friends     FriendsStruct
}

type UserSettings struct {
	RecentTracks bool `gorm:"default:true"`
}

type clientCacheStruct struct {
	UserID string
	Client *spotify.Client
}

var clientCache []*clientCacheStruct

const userRefreshTimeout = 10 * time.Minute

func (u *User) Client() *spotify.Client {
	client := config.SpotifyAPI.NewClient(u.Token)
	return &client
}

func GetUser(ID string) *User {
	var user User
	config.DB.Where("user_id = ?", ID).FirstOrCreate(&user)
	user.verifyifCompareCodeExists()
	return &user
}

func GetUserFromCompareCode(code string) *User {
	var user User
	config.DB.Where("compare_code = ?", code).FirstOrCreate(&user)
	return &user
}

func (u *User) Save() {
	config.DB.Save(u)
}

func (u *User) RefreshToken() error {
	if !u.Token.Valid() {
		// Try to refresh the token
		t, err := u.Client().Token()
		if err != nil {
			log.Infof("Could not refresh token for user %s", u.UserID)
			return err
		}
		u.Token = t
	}
	return nil
}

func (u *User) RefreshUser() error {
	if !u.Token.Valid() {
		return errors.New("Token expired")
	}
	if time.Since(u.LastUpdated) < userRefreshTimeout {
		return nil
	}
	client := config.SpotifyAPI.NewClient(u.Token)
	playlists, err := client.GetPlaylistsForUser(u.UserID)
	if err != nil {
		return err
	}

	// Get Playlists
	for playlistPage := 1; ; playlistPage++ {
		for _, s := range playlists.Playlists {
			u.Playlists = append(u.Playlists, Playlist{
				ID:   string(s.ID),
				Name: s.Name,
			})
		}
		err = client.NextPage(playlists)
		if err == spotify.ErrNoMorePages {
			break
		}
		if err != nil {
			return err
		}
	}

	spotifyData, err := client.CurrentUser()
	if err != nil {
		return err
	}
	u.DisplayName = spotifyData.DisplayName
	if len(spotifyData.Images) > 0 {
		u.Image = spotifyData.Images[0].URL
	}

	u.UserID = spotifyData.ID
	u.LastUpdated = time.Now()
	u.Save()
	return nil
}
