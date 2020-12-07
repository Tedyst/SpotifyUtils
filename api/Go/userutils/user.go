package userutils

import (
	"errors"
	"log"
	"time"

	"github.com/tedyst/spotifyutils/api/config"
	"github.com/tedyst/spotifyutils/api/logging"
	"github.com/zmb3/spotify"
	"golang.org/x/oauth2"
)

// User is the main user struct
type User struct {
	ID                string
	DisplayName       string
	Token             *oauth2.Token
	Images            []spotify.Image
	Playlists         []spotify.SimplePlaylist
	LastUpdated       time.Time
	Client            spotify.Client
	Settings          UserSettings
	RecentTracksTimer *chan struct{}
	Top               TopResult
	CompareCode       string
}

type UserSettings struct {
	RecentTracks bool
}

var usersCache []*User

const userRefreshTimeout = 10 * time.Minute

func GetUser(ID string) *User {
	for _, s := range usersCache {
		if s.ID == ID {
			return s
		}
	}
	rows, err := config.DB.Query("SELECT ID, RefreshToken, Expiration, CompareCode FROM users WHERE ID = ?", ID)
	defer rows.Close()
	if err != nil {
		logging.ReportError("userutils.GetUser()", err)
	}
	user := &User{
		ID:    ID,
		Token: new(oauth2.Token),
	}
	user.Token.TokenType = "Bearer"
	defer rows.Close()
	exists := false
	for rows.Next() {
		exists = true
		expiration := int64(0)
		err := rows.Scan(&user.ID,
			&user.Token.RefreshToken,
			&expiration,
			&user.CompareCode)
		user.Token.Expiry = time.Unix(expiration, 0)
		if err != nil {
			log.Println(err)
		}
	}
	user.Client = config.SpotifyAPI.NewClient(user.Token)

	user.Settings.RecentTracks = true

	if !exists {
		user.Token.Expiry = time.Now()
		user.CompareCode = generateNewCompareCode()

		_, err := config.DB.Exec(`INSERT INTO users (ID, RefreshToken, Expiration, CompareCode) VALUES(?,?,?,?)`,
			user.ID, "", user.Token.Expiry.Unix(), user.CompareCode)
		if err != nil {
			logging.ReportError("userutils.GetUser()", err)
		}
		usersCache = append(usersCache, user)
		return user
	}
	err = rows.Err()
	if err != nil {
		log.Println(err)
	}
	t, err := user.Client.Token()
	if err == nil {
		user.Token = t
	}

	usersCache = append(usersCache, user)
	go user.RefreshUser()
	return user
}

func GetUserFromCompareCode(code string) *User {
	for _, s := range usersCache {
		if s.CompareCode == code {
			return s
		}
	}
	rows, err := config.DB.Query("SELECT ID FROM users WHERE CompareCode = ?", code)
	defer rows.Close()
	if err != nil {
		logging.ReportError("userutils.GetUserFromCompareCode()", err)
		return nil
	}
	var uid string
	for rows.Next() {
		rows.Scan(&uid)
	}
	if uid != "" {
		return GetUser(uid)
	}
	return nil
}

func (u *User) Save() {
	_, err := config.DB.Exec(`UPDATE users SET RefreshToken = ?, Expiration = ? WHERE ID = ?`,
		u.Token.RefreshToken, u.Token.Expiry.Unix(), u.ID)
	if err != nil {
		log.Println(err)
	}
}

func (u *User) RefreshUser() error {
	if !u.Token.Valid() {
		return errors.New("Token expired")
	}
	if time.Since(u.LastUpdated) < userRefreshTimeout {
		return nil
	}
	client := config.SpotifyAPI.NewClient(u.Token)
	playlists, err := client.GetPlaylistsForUser(u.ID)
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
	u.Images = spotifyData.Images

	u.LastUpdated = time.Now()
	u.Save()
	return nil
}

func (u *User) GetImageURL() string {
	if len(u.Images) > 0 {
		return u.Images[0].URL
	}
	return ""
}
