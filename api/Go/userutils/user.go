package userutils

import (
	"errors"
	"time"

	"github.com/tedyst/spotifyutils/api/config"
	"github.com/zmb3/spotify"
	"golang.org/x/oauth2"
	"gorm.io/gorm"
)

// User is the main user struct
type User struct {
	gorm.Model
	UserID      string
	DisplayName string
	Token       *oauth2.Token `gorm:"embedded;embeddedPrefix:token_"`
	Image       string
	Playlists   PlaylistsStruct
	LastUpdated time.Time
	Settings    UserSettings `gorm:"embedded;embeddedPrefix:settings_"`
	Top         TopStruct    `gorm:"embedded;embeddedPrefix:top_"`
	CompareCode string
}

type UserSettings struct {
	RecentTracks bool
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
		u.Playlists = append(u.Playlists, playlists.Playlists...)
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

	u.LastUpdated = time.Now()
	u.Save()
	return nil
}
