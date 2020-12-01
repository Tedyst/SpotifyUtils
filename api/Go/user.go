package main

import (
	"errors"
	"time"

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

var storage []User

func getUser(ID string) User {
	for _, s := range storage {
		if s.ID == ID {
			return s
		}
	}
	u := User{
		ID:          ID,
		DisplayName: ID,
	}
	return u
}

func addUser(u User) {
	for i, s := range storage {
		if s.ID == u.ID {
			storage[i] = u
			return
		}
	}
	storage = append(storage, u)
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
	return nil
}
