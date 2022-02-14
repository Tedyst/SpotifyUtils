package status

import (
	"encoding/json"
	"fmt"
	"net/http"

	servertiming "github.com/mitchellh/go-server-timing"
	"github.com/tedyst/spotifyutils/api/utils"
	"github.com/tedyst/spotifyutils/auth"
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

type responseError struct {
	Success bool
	Error   string
}

// StatusHandler returns the basic data of the user, like username, image, playlists, etc.
// swagger:route GET /status status status
// Produces:
// - application/json
// responses:
//   200: statusAPIResponse
//   default: Error
func StatusHandler(res http.ResponseWriter, req *http.Request) {
	res.Header().Set("Content-Type", "application/json")
	timing := servertiming.FromContext(req.Context())

	user, err := auth.GetUserFromRequest(req)
	if err != nil {
		// Not using utils.ErrorString() because we want to return a 200 status code, for the CSRF to work
		response := &responseError{}
		response.Success = false
		response.Error = "not logged in"
		respJSON, _ := json.Marshal(response)
		fmt.Fprint(res, string(respJSON))
		return
	}

	refreshtoken := timing.NewMetric("RefreshToken").Start()
	err = user.RefreshToken()
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

	response := &response{
		Success:   true,
		UserID:    user.UserID,
		Image:     user.Image,
		Playlists: user.Playlists,
		Settings:  user.Settings,
	}
	if user.DisplayName == "" {
		response.Username = user.UserID
	} else {
		response.Username = user.DisplayName
	}

	respJSON, err := json.Marshal(response)
	if err != nil {
		utils.ErrorErr(res, req, err)
		return
	}
	fmt.Fprint(res, string(respJSON))
}
