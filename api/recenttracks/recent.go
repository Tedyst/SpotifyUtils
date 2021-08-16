package recenttracks

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/tedyst/spotifyutils/api/utils"
	"github.com/tedyst/spotifyutils/config"
	"github.com/tedyst/spotifyutils/userutils"
)

type responseSong struct {
	Name   string
	Artist string
	URI    string
	Image  string
	Count  int32
}

type response struct {
	Results []responseSong
	Success bool
}

func Handler(res http.ResponseWriter, req *http.Request, user *userutils.User) {
	response := &response{}
	if *config.MockExternalCalls {
		utils.ErrorString(res, req, "MockExternalCalls enabled, could not contact Spotify")
		return
	}

	response.Success = true
	recentTracks, err := user.GetRecentTracks()
	if err != nil {
		utils.ErrorErr(res, req, err)
		return
	}
	count := make(map[string]int32)
	for _, s := range recentTracks {
		count[s.TrackID]++
	}

	for _, s := range recentTracks {
		if count[s.TrackID] == 0 {
			continue
		}
		response.Results = append(response.Results, responseSong{
			Name:   s.Name,
			Artist: s.ArtistString(),
			URI:    s.TrackID,
			Image:  s.Information.TrackInformation.Image,
			Count:  count[s.TrackID],
		})
		count[s.TrackID] = 0
	}

	respJSON, err := json.Marshal(response)
	if err != nil {
		utils.ErrorErr(res, req, err)
		return
	}
	fmt.Fprint(res, string(respJSON))
}
