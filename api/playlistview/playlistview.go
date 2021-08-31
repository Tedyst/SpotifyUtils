package playlistview

import (
	"encoding/json"
	"fmt"
	"net/http"

	servertiming "github.com/mitchellh/go-server-timing"
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
	Analyze playlist.AnalyzeStruct
}

func Handler(res http.ResponseWriter, req *http.Request, user *userutils.User) {
	vars := mux.Vars(req)
	code := vars["playlist"]
	response := &response{}

	if len(code) != 22 {
		response.Success = false
		utils.ErrorString(res, req, "Invalid playlist ID length")
		return
	}

	if *config.MockExternalCalls {
		utils.ErrorString(res, req, "MockExternalCalls enabled, could not contact Spotify")
		return
	}

	response.Success = true
	timing := servertiming.FromContext(req.Context())
	getplaylist := timing.NewMetric("GetPlaylist").Start()
	cl := user.Client()
	pl, err := user.GetPlaylistTracks(code, *cl)
	getplaylist.Stop()
	if err != nil {
		utils.ErrorErr(res, req, err)
		return
	}

	gettracks := timing.NewMetric("GetTracks").Start()
	tracks.BatchUpdate(pl, *cl)
	gettracks.Stop()
	for _, s := range pl {
		response.Results = append(response.Results, responseSong{
			Image:  s.Information.TrackInformation.Image,
			URI:    s.TrackID,
			Artist: s.ArtistString(),
			Name:   s.Name,
		})
	}
	analyze := timing.NewMetric("Analyze").Start()
	response.Analyze = playlist.Analyze(pl)
	analyze.Stop()

	respJSON, err := json.Marshal(response)
	if err != nil {
		utils.ErrorErr(res, req, err)
		return
	}
	fmt.Fprint(res, string(respJSON))
}
