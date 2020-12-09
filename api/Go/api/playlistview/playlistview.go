package playlistview

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/tedyst/spotifyutils/api/tracks"

	"github.com/gorilla/mux"
	"github.com/tedyst/spotifyutils/api/config"
	"github.com/tedyst/spotifyutils/api/userutils"
)

func Handler(res http.ResponseWriter, req *http.Request) {
	res.Header().Set("Content-Type", "application/json")
	session, _ := config.SessionStore.Get(req, "username")
	vars := mux.Vars(req)
	type RespSong struct {
		Name     string `json:"name"`
		Artist   string `json:"artist"`
		URI      string `json:"uri"`
		ImageURL string `json:"image_url"`
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
	code := vars["playlist"]
	user := userutils.GetUser(val.(string))

	response.Success = true
	cl := user.Client()
	playlist := user.GetPlaylistTracks(code, *cl)
	tracks.BatchUpdate(playlist, *cl)
	for _, s := range playlist {
		response.Results = append(response.Results, RespSong{
			ImageURL: s.Information.TrackInformation.Image,
			URI:      s.TrackID,
			Artist:   s.Artist,
			Name:     s.Name,
		})
	}

	respJSON, _ := json.Marshal(response)
	fmt.Fprintf(res, string(respJSON))
}
