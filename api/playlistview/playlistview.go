package playlistview

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/tedyst/spotifyutils/playlist"
	"github.com/tedyst/spotifyutils/tracks"

	"github.com/gorilla/mux"
	"github.com/tedyst/spotifyutils/config"
	"github.com/tedyst/spotifyutils/userutils"
)

func Handler(res http.ResponseWriter, req *http.Request) {
	res.Header().Set("Content-Type", "application/json")
	session, _ := config.SessionStore.Get(req, "username")
	vars := mux.Vars(req)
	type RespSong struct {
		Name   string
		Artist string
		URI    string
		Image  string
	}
	type Resp struct {
		Results []RespSong
		Success bool
		Error   string
		Analyze playlist.AnalyzeStruct
	}
	response := &Resp{}

	if *config.MockExternalCalls {
		response.Success = false
		response.Error = "MockExternalCalls enabled, could not contact Spotify"
		respJSON, _ := json.Marshal(response)
		fmt.Fprint(res, string(respJSON))
		return
	}

	if _, ok := session.Values["username"]; !ok {
		response.Success = false
		response.Error = "Not logged in"
		respJSON, _ := json.Marshal(response)
		fmt.Fprint(res, string(respJSON))
		return
	}
	val := session.Values["username"]
	code := vars["playlist"]
	user := userutils.GetUser(val.(string))

	response.Success = true
	cl := user.Client()
	pl := user.GetPlaylistTracks(code, *cl)
	tracks.BatchUpdate(pl, *cl)
	for _, s := range pl {
		response.Results = append(response.Results, RespSong{
			Image:  s.Information.TrackInformation.Image,
			URI:    s.TrackID,
			Artist: s.ArtistString(),
			Name:   s.Name,
		})
	}
	response.Analyze = playlist.Analyze(pl)

	respJSON, _ := json.Marshal(response)
	fmt.Fprint(res, string(respJSON))
}
