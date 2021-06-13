package recenttracks

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/tedyst/spotifyutils/api/utils"
	"github.com/tedyst/spotifyutils/config"
	"github.com/tedyst/spotifyutils/userutils"
	"github.com/zmb3/spotify"
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
	recentTracks := user.GetRecentTracks()
	var ids []spotify.ID
	count := make(map[string]int32)
	for _, s := range recentTracks {
		ok := true
		for _, s1 := range ids {
			if s1 == s.Track.ID {
				ok = false
				count[s.Track.ID.String()]++
				break
			}
		}
		if ok {
			ids = append(ids, s.Track.ID)
			count[s.Track.ID.String()] = 1
		}
	}
	tracksinfo, err := user.Client().GetTracks(ids...)
	if err != nil {
		utils.ErrorErr(res, req, err)
		return
	}
	for _, s := range tracksinfo {
		image := ""
		if len(s.Album.Images) > 0 {
			image = s.Album.Images[0].URL
		}
		var artistsStr string
		for _, s := range s.Artists {
			artistsStr += s.Name + ", "
		}
		artistsStr = artistsStr[:len(artistsStr)-2]
		respsong := responseSong{
			Name:   s.Name,
			Artist: artistsStr,
			URI:    string(s.ID),
			Image:  image,
			Count:  count[s.ID.String()],
		}

		response.Results = append(response.Results, respsong)
	}

	respJSON, err := json.Marshal(response)
	if err != nil {
		utils.ErrorErr(res, req, err)
		return
	}
	fmt.Fprint(res, string(respJSON))
}
