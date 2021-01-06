package recenttracks

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/tedyst/spotifyutils/config"
	"github.com/tedyst/spotifyutils/tracks"
	"github.com/tedyst/spotifyutils/userutils"
	"github.com/zmb3/spotify"
)

func Handler(res http.ResponseWriter, req *http.Request) {
	res.Header().Set("Content-Type", "application/json")
	session, _ := config.SessionStore.Get(req, "username")
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
	user := userutils.GetUser(val.(string))

	response.Success = true
	recentTracks := user.GetRecentTracks()
	var ids []spotify.ID
	for _, s := range recentTracks {
		ids = append(ids, s.Track.ID)
	}
	tracksinfo, err := user.Client().GetTracks(ids...)
	if err != nil {
		response.Success = false
		response.Error = fmt.Sprint(err)
		respJSON, _ := json.Marshal(response)
		fmt.Fprint(res, string(respJSON))
		return
	}
	for i, s := range recentTracks {
		image := ""
		if len(tracksinfo[i].Album.Images) > 0 {
			image = tracksinfo[i].Album.Images[0].URL
		}
		respsong := RespSong{
			Name:   s.Track.Name,
			Artist: s.Track.Artists[0].Name,
			URI:    string(s.Track.ID),
			Image:  image,
		}

		go func(resp RespSong) {
			track := tracks.GetTrackFromID(resp.URI)
			if track.Artist == "" || track.Information.TrackInformation.Image == "" || track.Name == "" {
				track.Artist = resp.Artist
				track.Information.TrackInformation.Image = resp.Image
				track.Name = resp.Name
				track.TrackID = resp.URI
			}
		}(respsong)

		response.Results = append(response.Results, respsong)
	}

	respJSON, err := json.Marshal(response)
	if err != nil {
		response.Success = false
		response.Error = fmt.Sprint(err)
		respJSON, _ := json.Marshal(response)
		fmt.Fprint(res, string(respJSON))
		return
	}
	fmt.Fprint(res, string(respJSON))
}
