package status

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/tedyst/spotifyutils/api/config"
	"github.com/tedyst/spotifyutils/api/userutils"
)

func StatusHandler(res http.ResponseWriter, req *http.Request) {
	type playlistResponse struct {
		ID     string   `json:"id,omitempty"`
		Name   string   `json:"name,omitempty"`
		Tracks []string `json:"tracks,omitempty"`
	}
	type statusAPIResponse struct {
		Success   bool               `json:"success"`
		Error     string             `json:"error,omitempty"`
		Username  string             `json:"username,omitempty"`
		Image     string             `json:"image,omitempty"`
		Playlists []playlistResponse `json:"playlists,omitempty"`
	}
	res.Header().Set("Content-Type", "application/json")
	session, _ := config.SessionStore.Get(req, "username")
	response := &statusAPIResponse{}
	if _, ok := session.Values["username"]; !ok {
		response.Success = false
		response.Error = "Not Logged in!"
		respJSON, _ := json.Marshal(response)
		fmt.Fprintf(res, string(respJSON))
		return
	}
	val := session.Values["username"]
	user := userutils.GetUser(val.(string))
	if !user.Token.Valid() {
		response.Success = false
		response.Error = "Token not valid!"
		respJSON, _ := json.Marshal(response)
		fmt.Fprintf(res, string(respJSON))
		return
	}
	user.RefreshUser()
	user.StartRecentTracksUpdater()
	go user.Save()

	response.Success = true
	if user.DisplayName == "" {
		response.Username = user.ID
	} else {
		response.Username = user.DisplayName
	}

	if len(user.Images) > 0 {
		response.Image = user.Images[0].URL
	}

	for _, s := range user.Playlists {
		playlist := &playlistResponse{
			ID:   string(s.ID),
			Name: s.Name,
		}
		response.Playlists = append(response.Playlists, *playlist)
	}
	respJSON, _ := json.Marshal(response)
	fmt.Fprintf(res, string(respJSON))
}
