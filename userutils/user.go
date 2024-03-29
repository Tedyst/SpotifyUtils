package userutils

import (
	"errors"
	"fmt"
	"strings"
	"time"

	log "github.com/sirupsen/logrus"
	"github.com/tedyst/spotifyutils/config"
	"github.com/tedyst/spotifyutils/mapofmutex"
	"github.com/tedyst/spotifyutils/metrics"
	"github.com/zmb3/spotify"
	"golang.org/x/oauth2"
	"gorm.io/gorm"
)

var userMutex struct {
	RefreshToken *mapofmutex.M
	RefreshUser  *mapofmutex.M
	RefreshTop   *mapofmutex.M
}

func init() {
	userMutex.RefreshToken = mapofmutex.New()
	userMutex.RefreshTop = mapofmutex.New()
	userMutex.RefreshUser = mapofmutex.New()
}

// User is the main user struct
type User struct {
	ID          uint           `gorm:"primarykey" json:"-"`
	CreatedAt   time.Time      `json:"-"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
	UserID      string         `gorm:"unique"`
	DisplayName string
	Token       *oauth2.Token `gorm:"embedded;embeddedPrefix:token_" json:"-"`
	Image       string
	Playlists   PlaylistsStruct
	LastUpdated time.Time    `json:"-"`
	Settings    UserSettings `gorm:"embedded;embeddedPrefix:settings_"`
	Top         TopStruct    `gorm:"embedded;embeddedPrefix:top_"`
	CompareCode string       `gorm:"unique"`
	Friends     FriendsStruct
}

type UserSettings struct {
	RecentTracks bool `gorm:"default:false"`
}

const userRefreshTimeout = 10 * time.Minute

func (u *User) Client() *spotify.Client {
	u.RefreshToken()
	client := config.SpotifyAPI.NewClient(u.Token)
	return &client
}

// GetUser gets the user from the database by ID
func GetUser(ID string) *User {
	u, ok := config.UserCache.Get(ID)
	if ok {
		us := u.(User)
		return &us
	}
	var user User
	config.DB.Where("user_id = ?", ID).FirstOrCreate(&user, User{
		UserID: ID,
	})
	user.verifyifCompareCodeExists()
	config.UserCache.Set(ID, user, 1)
	return &user
}

// GetUser gets the user from the database by Compare Code
func GetUserFromCompareCode(code string) *User {
	var user User
	if err := config.DB.Where("compare_code = ?", code).First(&user).Error; err != nil {
		return nil
	}
	return &user
}

// Save
func (u *User) Save() error {
	config.UserCache.Set(u.UserID, *u, 1)
	if err := config.DB.Save(u).Error; err != nil {
		log.WithFields(log.Fields{
			"type":        "user",
			"user":        u,
			"tokenExpiry": u.Token.Expiry,
		}).Error(err)
		return err
	}
	return nil
}

func (u *User) String() string {
	return u.UserID
}

// RefreshToken refreshes the user's token
func (u *User) RefreshToken() error {
	if *config.MockExternalCalls {
		return nil
	}
	if u.Token == nil {
		return errors.New("token is nil")
	}
	unlocker := userMutex.RefreshToken.Lock(u.UserID)
	defer unlocker.Unlock()
	if u.Token.RefreshToken == "" {
		log.WithFields(log.Fields{
			"type":        "refresh-token",
			"user":        u,
			"tokenExpiry": u.Token.Expiry,
		}).Debug("Cannot refresh token, user deleted access to application")
		return errors.New("cannot refresh token, user deleted access to application")
	}
	if !u.Token.Valid() || time.Until(u.Token.Expiry) < 3*time.Minute {
		// Try to refresh the token
		log.WithFields(log.Fields{
			"user": u,
		}).Debug("Trying to refresh token")
		client := config.SpotifyAPI.NewClient(u.Token)
		metrics.SpotifyRequests.Add(1)
		t, err := client.Token()
		if err != nil {
			log.WithFields(log.Fields{
				"type":        "refresh-token",
				"user":        u,
				"tokenExpiry": u.Token.Expiry,
			}).Error(err)
			if strings.Contains(fmt.Sprint(err), "Refresh token revoked") {
				log.WithFields(log.Fields{
					"type":        "refresh-token",
					"user":        u,
					"tokenExpiry": u.Token.Expiry,
				}).Debug("Refresh token revoked")
				u.StopRecentTracksUpdater()
				u.Settings.RecentTracks = false
				u.Token.RefreshToken = ""
				u.Save()
			}
			if strings.Contains(fmt.Sprint(err), "User does not exist") {
				log.WithFields(log.Fields{
					"type":        "refresh-token",
					"user":        u,
					"tokenExpiry": u.Token.Expiry,
				}).Debug("User got deleted by Spotify")
				config.DB.Delete(u)
				u.Save()
			}
			return err
		}
		u.Token = t
		u.Save()
	}
	return nil
}

// RefreshUser refreshes the user's information
func (u *User) RefreshUser() error {
	unlocker := userMutex.RefreshUser.Lock(u.UserID)
	defer unlocker.Unlock()
	if !u.Token.Valid() {
		log.WithFields(log.Fields{
			"type":        "refresh-token",
			"user":        u,
			"tokenExpiry": u.Token.Expiry,
		}).Debug("Token invalid")
		return errors.New("token invalid")
	}
	if time.Since(u.LastUpdated) < userRefreshTimeout {
		return nil
	}
	client := config.SpotifyAPI.NewClient(u.Token)
	metrics.SpotifyRequests.Add(1)
	playlists, err := client.GetPlaylistsForUser(u.UserID)
	if err != nil {
		return err
	}

	u.Playlists = PlaylistsStruct{}
	// Get Playlists
	for playlistPage := 1; ; playlistPage++ {
		for _, s := range playlists.Playlists {
			u.Playlists = append(u.Playlists, Playlist{
				ID:   string(s.ID),
				Name: s.Name,
			})
		}
		metrics.SpotifyRequests.Add(1)
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
