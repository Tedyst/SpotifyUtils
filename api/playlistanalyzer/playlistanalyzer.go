package playlistanalyzer

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/tedyst/spotifyutils/config"
	"github.com/tedyst/spotifyutils/playlist"
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
		Result  playlist.AnalyzeStruct
		Success bool
		Error   string
	}
	response := &Resp{}
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
	pl := user.GetPlaylistTracks(code, *user.Client())

	response.Result = playlist.Analyze(pl)
	return
}
