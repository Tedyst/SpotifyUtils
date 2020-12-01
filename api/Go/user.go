package main

import (
	"errors"
	"log"
	"time"

	"github.com/michaeljs1990/sqlitestore"
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
}

var usersCache []*User
var sessionStore *sqlitestore.SqliteStore

func getUser(ID string) *User {
	for _, s := range usersCache {
		if s.ID == ID {
			return s
		}
	}
	rows, err := db.Query("SELECT ID, DisplayName, Token, RefreshToken FROM users WHERE ID = ?", ID)
	if err != nil {
		log.Println(err)
	}
	user := &User{
		ID:          ID,
		DisplayName: ID,
		Token:       new(oauth2.Token),
	}
	user.Token.Expiry = time.Now()
	user.Token.TokenType = "Bearer"
	defer rows.Close()
	exists := false
	for rows.Next() {
		exists = true
		err := rows.Scan(&user.ID,
			&user.DisplayName,
			&user.Token.AccessToken,
			&user.Token.RefreshToken)
		if err != nil {
			log.Fatal(err)
		}
	}
	if !exists {
		_, err := db.Exec(`INSERT INTO users (ID, DisplayName, Token, RefreshToken) VALUES(?,?,?,?)`,
			user.ID, user.DisplayName, "", "")
		if err != nil {
			log.Println(err)
		}
		usersCache = append(usersCache, user)
		return user
	}
	err = rows.Err()
	if err != nil {
		log.Fatal(err)
	}
	return user
}

func (u *User) save() {
	_, err := db.Exec(`UPDATE users SET DisplayName = ?, Token = ?, RefreshToken = ? WHERE ID = ?`,
		u.DisplayName, u.Token.AccessToken, u.Token.RefreshToken, u.ID)
	if err != nil {
		log.Println(err)
	}
}

func (u *User) refreshUser() error {
	if !u.Token.Valid() {
		return errors.New("Token expired")
	}
	if time.Since(u.LastUpdated) < time.Second*60 {
		return nil
	}
	client := spotifyAPI.NewClient(u.Token)
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

	u.LastUpdated = time.Now()
	u.save()
	return nil
}
