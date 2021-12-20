package trackapi

import (
	"encoding/json"
	"fmt"
	"net/http"

	servertiming "github.com/mitchellh/go-server-timing"
	"github.com/tedyst/spotifyutils/api/utils"
	"github.com/tedyst/spotifyutils/metrics"
	"github.com/tedyst/spotifyutils/tracks"
	"github.com/tedyst/spotifyutils/userutils"
	"github.com/zmb3/spotify"

	"github.com/gorilla/mux"
	"github.com/tedyst/spotifyutils/config"
)

// swagger:response trackAPIResponse
type _ struct {
	// in: body
	Body trackAPIResponse
}
type trackAPIResponse struct {
	Success bool
	Result  struct {
		Artist      string
		Name        string
		Information tracks.SpotifyInformation
		Lyrics      string
	}
}

// swagger:parameters trackAPIRequest
type _ struct {
	// in: path
	// required: true
	TrackID string
}

// Handler returns a track's information
// swagger:route GET /track/{TrackID} track trackAPIRequest
// Produces:
// - application/json
// responses:
//   200: trackAPIResponse
//   default: Error
func Handler(res http.ResponseWriter, req *http.Request, user *userutils.User) {
	response := &trackAPIResponse{}
	vars := mux.Vars(req)
	trackURI := vars["track"]
	if len(trackURI) == 36 {
		// If it contains spotify:track:
		trackURI = trackURI[14:]
	}
	if len(trackURI) != 22 {
		response.Success = false
		utils.ErrorString(res, req, "Invalid track ID length")
		return
	}

	timing := servertiming.FromContext(req.Context())
	checkiftrackexists := timing.NewMetric("CheckIfTrackExists").Start()
	// If the track dosen't exist
	if !tracks.TrackExists(trackURI) {
		checkiftrackexists.Stop()
		if !(*config.MockExternalCalls) {
			metrics.SpotifyRequests.Add(1)
			_, err := user.Client().GetTrack(spotify.ID(trackURI))
			if err != nil {
				utils.ErrorErr(res, req, err)
				return
			}
		} else {
			utils.ErrorString(res, req, "MockExternalCalls enabled, could not contact Spotify")
			return
		}
	}
	checkiftrackexists.Stop()
	gettrackfromdb := timing.NewMetric("GetTrackFromDB").Start()
	tr := tracks.GetTrackFromID(trackURI)
	gettrackfromdb.Stop()
	updatetrackinfo := timing.NewMetric("UpdateTrackInfo").Start()
	err := tr.Update(*user.Client(), false)
	updatetrackinfo.Stop()
	if err != nil {
		utils.ErrorErr(res, req, err)
		return
	}
	response.Result.Artist = tr.ArtistString()
	response.Result.Information = tr.Information
	response.Result.Name = tr.Name
	response.Result.Lyrics = tr.Lyrics
	response.Success = true

	respJSON, err := json.Marshal(response)
	if err != nil {
		utils.ErrorErr(res, req, err)
		return
	}
	fmt.Fprint(res, string(respJSON))
}
