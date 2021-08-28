package status

import (
	"encoding/json"
	"fmt"
	"net/http"

	servertiming "github.com/mitchellh/go-server-timing"
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

type responseError struct {
	Success bool
	Error   string
}

func StatusHandler(res http.ResponseWriter, req *http.Request) {
	res.Header().Set("Content-Type", "application/json")
	timing := servertiming.FromContext(req.Context())
	getfromsession := timing.NewMetric("GetFromSession").Start()
	session, _ := config.SessionStore.Get(req, "username")
	getfromsession.Stop()
	response := &response{}
	if _, ok := session.Values["username"]; !ok {
		response := &responseError{}
		response.Success = false
		response.Error = "not logged in"
		respJSON, _ := json.Marshal(response)
		fmt.Fprint(res, string(respJSON))
		return
	}
	getuser := timing.NewMetric("GetUser").Start()
	val := session.Values["username"]
	user := userutils.GetUser(val.(string))
	getuser.Stop()
	refreshtoken := timing.NewMetric("RefreshToken").Start()
	err := user.RefreshToken()
	refreshtoken.Stop()
	if err != nil {
		utils.ErrorErr(res, req, err)
		return
	}
	refreshuser := timing.NewMetric("RefreshUser").Start()
	user.RefreshUser()
	refreshuser.Stop()
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
