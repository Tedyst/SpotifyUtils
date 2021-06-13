package playlistview

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/tedyst/spotifyutils/api/utils"
	"github.com/tedyst/spotifyutils/playlist"
	"github.com/tedyst/spotifyutils/tracks"

	"github.com/gorilla/mux"
	"github.com/tedyst/spotifyutils/config"
	"github.com/tedyst/spotifyutils/userutils"
)

type responseSong struct {
	Name   string
	Artist string
	URI    string
	Image  string
}
type response struct {
	Results []responseSong
	Success bool
	Error   string `json:",omitempty"`
	Analyze playlist.AnalyzeStruct
}

func Handler(res http.ResponseWriter, req *http.Request, user *userutils.User) {
	vars := mux.Vars(req)
	code := vars["playlist"]
	response := &response{}

	if *config.MockExternalCalls {
		utils.ErrorString(res, req, "MockExternalCalls enabled, could not contact Spotify")
		return
	}

	response.Success = true
	cl := user.Client()
	pl := user.GetPlaylistTracks(code, *cl)
	tracks.BatchUpdate(pl, *cl)
	for _, s := range pl {
		response.Results = append(response.Results, responseSong{
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
