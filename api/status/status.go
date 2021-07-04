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
	Success   bool
	Username  string
	Image     string
	Playlists []userutils.Playlist
	UserID    string
	Settings  userutils.UserSettings
}

func StatusHandler(res http.ResponseWriter, req *http.Request) {
	res.Header().Set("Content-Type", "application/json")
	res.WriteHeader(http.StatusOK)
	session, _ := config.SessionStore.Get(req, "username")
	response := &response{}
	if _, ok := session.Values["username"]; !ok {
		utils.ErrorString(res, req, "Not Logged In")
		return
	}
	val := session.Values["username"]
	user := userutils.GetUser(val.(string))
	err := user.RefreshToken()
	if err != nil {
		utils.ErrorErr(res, req, err)
		return
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
