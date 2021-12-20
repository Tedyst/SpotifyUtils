package settings

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/tedyst/spotifyutils/api/utils"
	"github.com/tedyst/spotifyutils/config"
	"github.com/tedyst/spotifyutils/userutils"
)

// swagger:response settingsAPIResponse
type _ struct {
	// in: body
	Body settingsAPIResponse
}

// swagger:response settingsAPIRequest
type _ struct {
	// in: body
	Success bool
	Body    settingsAPIResponse
}
type settingsAPIResponse struct {
	Success  bool
	Settings userutils.UserSettings
}

// GetHandler returns the user's settings
// swagger:route GET /settings settings settings
// Produces:
// - application/json
// responses:
//   200: settingsAPIResponse
//   default: Error
func GetHandler(res http.ResponseWriter, req *http.Request, user *userutils.User) {
	response := &settingsAPIResponse{}
	response.Success = true
	response.Settings = user.Settings
	respJSON, _ := json.Marshal(response)
	fmt.Fprint(res, string(respJSON))
}

// PostHandler handles the saving of user settings
// swagger:route POST /settings settings settingsAPIRequest
// Produces:
// - application/json
// responses:
//   200: settingsAPIResponse
//   default: Error
func PostHandler(res http.ResponseWriter, req *http.Request, user *userutils.User) {
	response := &settingsAPIResponse{}

	request := &userutils.UserSettings{}
	decoder := json.NewDecoder(req.Body)
	err := decoder.Decode(request)
	if err != nil {
		utils.ErrorErr(res, req, err)
		return
	}

	user.Settings = *request
	go user.Save()

	response.Success = true
	response.Settings = user.Settings

	if !user.Settings.RecentTracks {
		config.DB.Where("user = ?", fmt.Sprint(user.ID)).Delete(userutils.RecentTracks{})
	} else {
		user.StartRecentTracksUpdater()
	}

	respJSON, err := json.Marshal(response)
	if err != nil {
		utils.ErrorErr(res, req, err)
		return
	}
	fmt.Fprint(res, string(respJSON))
}

func Handler(res http.ResponseWriter, req *http.Request, user *userutils.User) {
	if req.Method == "GET" {
		GetHandler(res, req, user)
	} else if req.Method == "POST" {
		PostHandler(res, req, user)
	} else {
		utils.ErrorString(res, req, "Method not allowed")
	}
}
