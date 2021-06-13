package status

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/tedyst/spotifyutils/api/utils"
	"github.com/tedyst/spotifyutils/config"
	"github.com/tedyst/spotifyutils/userutils"
)

type response struct {
	Success   bool                   `json:"success"`
	Error     string                 `json:"error,omitempty"`
	Username  string                 `json:"username,omitempty"`
	Image     string                 `json:"image,omitempty"`
	Playlists []userutils.Playlist   `json:"playlists,omitempty"`
	UserID    string                 `json:"id"`
	Settings  userutils.UserSettings `json:"settings"`
}

func StatusHandler(res http.ResponseWriter, req *http.Request) {
	res.Header().Set("Content-Type", "application/json")
	session, _ := config.SessionStore.Get(req, "username")
	response := &response{}
	if _, ok := session.Values["username"]; !ok {
		utils.ErrorString(res, req, "Not Logged In")
		return
	}
	val := session.Values["username"]
	user := userutils.GetUser(val.(string))
	if !user.Token.Valid() && !(*config.MockExternalCalls) {
		// Try to refresh the token
		t, err := user.Client().Token()
		if err != nil {
			utils.ErrorString(res, req, "Token not valid")
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

	response.UserID = user.UserID
	response.Image = user.Image

	response.Playlists = user.Playlists
	response.Settings = user.Settings

	respJSON, _ := json.Marshal(response)
	fmt.Fprint(res, string(respJSON))
}
