package spotifywrapper

import (
	"fmt"
	"net/url"

	"github.com/tedyst/spotifyutils/config"
	"github.com/zmb3/spotify"
	"golang.org/x/oauth2"
)

type spotifyAuthorization struct {
	success bool
}

func GetSpotifyURL(host string) string {
	u, _ := url.Parse("https://accounts.spotify.com/authorize")
	q, _ := url.ParseQuery(u.RawQuery)
	q.Add("client_id", *config.SpotifyClientID)
	q.Add("response_type", "code")
	q.Add("redirect_uri", fmt.Sprintf("%s/auth", host))
	q.Add("scope", config.SpotifyScope)
	u.RawQuery = q.Encode()
	return u.String()
}

func GetSpotifyAuthorization(host string, code string) (*oauth2.Token, error) {
	u, _ := url.Parse("https://accounts.spotify.com/api/token")
	q, _ := url.ParseQuery(u.RawQuery)
	q.Add("grant_type", "authorization_code")
	q.Add("code", code)
	q.Add("redirect_uri", fmt.Sprintf("%s/auth", host))
	u.RawQuery = q.Encode()

	auth := spotify.NewAuthenticator(fmt.Sprintf("%s/auth", host), config.SpotifyScope)
	auth.SetAuthInfo(*config.SpotifyClientID, *config.SpotifyClientSecret)
	token, err := auth.Exchange(code)
	if err != nil {
		return nil, err
	}
	return token, nil
}
