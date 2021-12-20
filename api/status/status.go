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

// swagger:response statusAPIResponse
type _ struct {
	// in: body
	Body response
}

type response struct {
	Success   bool
	Username  string
	Image     string
	Playlists []userutils.Playlist
	UserID    string
	Settings  userutils.UserSettings
}

// StatusHandler returns the basic data of the user, like username, image, playlists, etc.
// swagger:route GET /status status
// Produces:
// - application/json
// responses:
//   200: statusAPIResponse
//   default: Error
func StatusHandler(res http.ResponseWriter, req *http.Request) {
	res.Header().Set("Content-Type", "application/json")
	timing := servertiming.FromContext(req.Context())
	getfromsession := timing.NewMetric("GetFromSession").Start()
	session, _ := config.SessionStore.Get(req, "username")
	getfromsession.Stop()
	response := &response{}
	if _, ok := session.Values["username"]; !ok {
		utils.ErrorString(res, req, "Not logged in")
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

	respJSON, err := json.Marshal(response)
	if err != nil {
		utils.ErrorErr(res, req, err)
		return
	}
	fmt.Fprint(res, string(respJSON))
}
