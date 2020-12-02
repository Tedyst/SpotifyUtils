package userutils

import (
	"errors"
	"log"
	"time"

	"github.com/tedyst/spotifyutils/api/config"
	"github.com/zmb3/spotify"
	"golang.org/x/oauth2"
)

// User is the main user struct
type User struct {
	ID          string
	DisplayName string
	Token       *oauth2.Token
	Images      []spotify.Image
	Playlists   []spotify.SimplePlaylist
	LastUpdated time.Time
	Client      spotify.Client
	Settings    UserSettings
}

type UserSettings struct {
	TrackListening bool
}

var usersCache []*User

func GetUser(ID string) *User {
	for _, s := range usersCache {
		if s.ID == ID {
			return s
		}
	}
	rows, err := config.DB.Query("SELECT ID, Token, RefreshToken, Expiration FROM users WHERE ID = ?", ID)
	if err != nil {
		log.Println(err)
	}
	user := &User{
		ID:    ID,
		Token: new(oauth2.Token),
	}
	user.Token.Expiry = time.Now()
	user.Token.TokenType = "Bearer"
	defer rows.Close()
	exists := false
	for rows.Next() {
		exists = true
		expiration := int64(0)
		err := rows.Scan(&user.ID,
			&user.Token.AccessToken,
			&user.Token.RefreshToken,
			&expiration)
		user.Token.Expiry = time.Unix(expiration, 0)
		if err != nil {
			log.Println(err)
		}
	}
	user.Client = config.SpotifyAPI.NewClient(user.Token)

	user.Settings.TrackListening = true

	if !exists {
		_, err := config.DB.Exec(`INSERT INTO users (ID, Token, RefreshToken, Expiration) VALUES(?,?,?,?)`,
			user.ID, "", "", user.Token.Expiry.Unix())
		if err != nil {
			log.Println(err)
		}
		usersCache = append(usersCache, user)
		return user
	}
	err = rows.Err()
	if err != nil {
		log.Println(err)
	}
	usersCache = append(usersCache, user)
	return user
}

func (u *User) Save() {
	_, err := config.DB.Exec(`UPDATE users SET Token = ?, RefreshToken = ?, Expiration = ? WHERE ID = ?`,
		u.Token.AccessToken, u.Token.RefreshToken, u.Token.Expiry.Unix(), u.ID)
	if err != nil {
		log.Println(err)
	}
}

func (u *User) RefreshUser() error {
	if !u.Token.Valid() {
		return errors.New("Token expired")
	}
	if time.Since(u.LastUpdated) < time.Hour {
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
