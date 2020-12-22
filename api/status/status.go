package status

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/tedyst/spotifyutils/config"
	"github.com/tedyst/spotifyutils/userutils"
)

func StatusHandler(res http.ResponseWriter, req *http.Request) {
	type statusAPIResponse struct {
		Success   bool                 `json:"success"`
		Error     string               `json:"error,omitempty"`
		Username  string               `json:"username,omitempty"`
		Image     string               `json:"image,omitempty"`
		Playlists []userutils.Playlist `json:"playlists,omitempty"`
	}
	res.Header().Set("Content-Type", "application/json")
	session, _ := config.SessionStore.Get(req, "username")
	response := &statusAPIResponse{}
	if _, ok := session.Values["username"]; !ok {
		response.Success = false
		response.Error = "Not Logged in"
		respJSON, _ := json.Marshal(response)
		fmt.Fprint(res, string(respJSON))
		return
	}
	val := session.Values["username"]
	user := userutils.GetUser(val.(string))
	if !user.Token.Valid() {
		// Try to refresh the token
		t, err := user.Client().Token()
		if err != nil {
			response.Success = false
			response.Error = "Token not valid!"
			respJSON, _ := json.Marshal(response)
			fmt.Fprint(res, string(respJSON))
			return
		}
		user.Token = t
	}
	user.RefreshUser()
	user.StartRecentTracksUpdater()
	go user.Save()

	response.Success = true
	if user.DisplayName == "" {
		response.Username = user.UserID
	} else {
		response.Username = user.DisplayName
	}

	response.Image = user.Image

	response.Playlists = user.Playlists

	respJSON, _ := json.Marshal(response)
	fmt.Fprint(res, string(respJSON))
}
