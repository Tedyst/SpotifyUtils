package settings

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/tedyst/spotifyutils/api/utils"
	"github.com/tedyst/spotifyutils/config"
	"github.com/tedyst/spotifyutils/userutils"
)

type response struct {
	Success  bool
	Settings userutils.UserSettings
}

func Handler(res http.ResponseWriter, req *http.Request, user *userutils.User) {
	response := &response{}

	if req.Method == "GET" {
		response.Success = true
		response.Settings = user.Settings
		respJSON, _ := json.Marshal(response)
		fmt.Fprint(res, string(respJSON))
		return
	} else if req.Method != "POST" {
		utils.ErrorString(res, req, "Method not allowed")
		return
	}

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
