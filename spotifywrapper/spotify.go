package spotifywrapper

import (
	"fmt"
	"net/url"

	"github.com/tedyst/spotifyutils/config"
	"github.com/tedyst/spotifyutils/metrics"
	"github.com/zmb3/spotify"
	"golang.org/x/oauth2"
)

type spotifyAuthorization struct {
	Success bool
}

func GetSpotifyURL(host string) string {
	u, _ := url.Parse("https://accounts.spotify.com/authorize")
	q, _ := url.ParseQuery(u.RawQuery)
	if *config.MockExternalCalls {
		q.Add("client_id", "client_id")
	} else {
		q.Add("client_id", *config.SpotifyClientID)
	}
	q.Add("response_type", "code")
	q.Add("redirect_uri", fmt.Sprintf("%s/auth", host))
	q.Add("scope", config.SpotifyScope)
	u.RawQuery = q.Encode()
	return u.String()
}

func GetSpotifyAuthorization(host string, code string) (*oauth2.Token, error) {
	if *config.MockExternalCalls {
		return &oauth2.Token{}, nil
	}
	newHost := fmt.Sprintf("%s/auth", host)
	auth := spotify.NewAuthenticator(newHost, config.SpotifyScope)
	auth.SetAuthInfo(*config.SpotifyClientID, *config.SpotifyClientSecret)
	metrics.SpotifyRequests.Add(1)
	token, err := auth.Exchange(code)
	if err != nil {
		return nil, err
	}
	return token, nil
}
