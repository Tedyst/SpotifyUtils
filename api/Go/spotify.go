package main

import (
	"fmt"
	"net/url"

	"github.com/zmb3/spotify"
	"golang.org/x/oauth2"
)

type spotifyAuthorization struct {
	success bool
}

func getSpotifyURL(host string) string {
	u, _ := url.Parse("https://accounts.spotify.com/authorize")
	q, _ := url.ParseQuery(u.RawQuery)
	q.Add("client_id", clientID)
	q.Add("response_type", "code")
	q.Add("redirect_uri", fmt.Sprintf("%s/auth", host))
	q.Add("scope", scope)
	u.RawQuery = q.Encode()
	return u.String()
}

func getSpotifyAuthorization(host string, code string) (*oauth2.Token, error) {
	u, _ := url.Parse("https://accounts.spotify.com/api/token")
	q, _ := url.ParseQuery(u.RawQuery)
	q.Add("grant_type", "authorization_code")
	q.Add("code", code)
	q.Add("redirect_uri", fmt.Sprintf("%s/auth", host))
	u.RawQuery = q.Encode()

	// client := &http.Client{}
	// req, err := http.NewRequest("POST", u.String(), nil)
	// if err != nil {
	// 	return nil
	// }
	auth := spotify.NewAuthenticator(fmt.Sprintf("%s/auth", host), scope)
	auth.SetAuthInfo(clientID, clientSecret)
	token, err := auth.Exchange(code)
	if err != nil {
		return nil, err
	}
	return token, nil
	// b64auth := base64.StdEncoding.EncodeToString([]byte(fmt.Sprintf("%s:%s", clientID, clientSecret)))
	// authorization := fmt.Sprintf("Authorization: Basic %s", b64auth)
	// req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	// req.Header.Set("Authorization", authorization)
	// resp, err := client.Do(req)
	// if err != nil {
	// 	return ""
	// }
	// fmt.Println(b64auth)
	// bodyBytes, _ := ioutil.ReadAll(resp.Body)
	// fmt.Println(string(bodyBytes))
	// return "Asd"
}
