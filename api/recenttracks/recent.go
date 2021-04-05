package recenttracks

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/tedyst/spotifyutils/config"
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
		Count  int32
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
		response.Success = false
		response.Error = fmt.Sprint(err)
		respJSON, _ := json.Marshal(response)
		fmt.Fprint(res, string(respJSON))
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
		respsong := RespSong{
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
		response.Success = false
		response.Error = fmt.Sprint(err)
		respJSON, _ := json.Marshal(response)
		fmt.Fprint(res, string(respJSON))
		return
	}
	fmt.Fprint(res, string(respJSON))
}
