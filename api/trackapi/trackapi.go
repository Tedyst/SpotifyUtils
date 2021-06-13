package trackapi

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/tedyst/spotifyutils/api/utils"
	"github.com/tedyst/spotifyutils/tracks"
	"github.com/tedyst/spotifyutils/userutils"
	"github.com/zmb3/spotify"

	"github.com/gorilla/mux"
	"github.com/tedyst/spotifyutils/config"
)

type response struct {
	Success bool
	Error   string `json:",omitempty"`
	Result  struct {
		Artist      string
		Name        string
		Information tracks.SpotifyInformation
		Lyrics      string
	}
}

func Handler(res http.ResponseWriter, req *http.Request, user *userutils.User) {
	response := &response{}
	vars := mux.Vars(req)
	trackURI := vars["track"]
	if len(trackURI) == 36 {
		// If it contains spotify:track:
		trackURI = trackURI[14:]
	}

	// If the track dosen't exist
	if !tracks.TrackExists(trackURI) {
		if !(*config.MockExternalCalls) {
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

	tr := tracks.GetTrackFromID(trackURI)
	err := tr.Update(*user.Client(), false)
	if err != nil {
		utils.ErrorErr(res, req, err)
		return
	}
	response.Result.Artist = tr.ArtistString()
	response.Result.Information = tr.Information
	response.Result.Name = tr.Name
	response.Result.Lyrics = tr.Lyrics
	response.Success = true

	respJSON, _ := json.Marshal(response)
	fmt.Fprint(res, string(respJSON))
}
