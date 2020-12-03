package recenttracks

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/tedyst/spotifyutils/api/config"
	"github.com/tedyst/spotifyutils/api/userutils"
	"github.com/zmb3/spotify"
)

func Handler(res http.ResponseWriter, req *http.Request) {
	res.Header().Set("Content-Type", "application/json")
	session, _ := config.SessionStore.Get(req, "username")
	type RespSong struct {
		Name       string `json:"name"`
		Artist     string `json:"artist"`
		Lyrics     string `json:"lyrics"`
		URI        string `json:"uri"`
		ImageURL   string `json:"image_url"`
		PreviewURL string `json:"preview_url"`
	}
	type Resp struct {
		Results []RespSong `json:"results"`
		Success bool       `json:"success"`
		Error   string     `json:"error,omitempty"`
	}
	response := &Resp{}
	if _, ok := session.Values["username"]; !ok {
		response.Success = false
		response.Error = "Not logged in"
		respJSON, _ := json.Marshal(response)
		fmt.Fprintf(res, string(respJSON))
		return
	}
	val := session.Values["username"]
	user := userutils.GetUser(val.(string))

	response.Success = true
	recentTracks := user.GetRecentTracks()
	var ids []spotify.ID
	for _, s := range recentTracks {
		ids = append(ids, s.Track.ID)
	}
	tracksinfo, err := user.Client.GetTracks(ids...)
	if err != nil {
		response.Success = false
		response.Error = fmt.Sprint(err)
		respJSON, _ := json.Marshal(response)
		fmt.Fprintf(res, string(respJSON))
		return
	}
	for i, s := range recentTracks {
		response.Results = append(response.Results, RespSong{
			Name:       s.Track.Name,
			Artist:     s.Track.Artists[0].Name,
			URI:        string(s.Track.ID),
			ImageURL:   tracksinfo[i].Album.Images[0].URL,
			PreviewURL: s.Track.PreviewURL,
		})
	}

	respJSON, _ := json.Marshal(response)
	fmt.Fprintf(res, string(respJSON))
}
