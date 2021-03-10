package settings

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/tedyst/spotifyutils/config"
	"github.com/tedyst/spotifyutils/userutils"
)

func Handler(res http.ResponseWriter, req *http.Request) {
	type Response struct {
		Success  bool
		Error    string `json:",omitempty"`
		Settings userutils.UserSettings
	}
	res.Header().Set("Content-Type", "application/json")
	session, _ := config.SessionStore.Get(req, "username")
	response := &Response{}
	if _, ok := session.Values["username"]; !ok {
		response.Success = false
		response.Error = "Not Logged in"
		respJSON, _ := json.Marshal(response)
		fmt.Fprint(res, string(respJSON))
		return
	}
	val := session.Values["username"]
	user := userutils.GetUser(val.(string))

	if req.Method != "POST" {
		response.Success = true
		response.Settings = user.Settings
		respJSON, _ := json.Marshal(response)
		fmt.Fprint(res, string(respJSON))
		return
	}

	request := &userutils.UserSettings{}
	decoder := json.NewDecoder(req.Body)
	err := decoder.Decode(request)
	if err != nil {
		response.Success = false
		response.Error = fmt.Sprint(err)
		respJSON, _ := json.Marshal(response)
		fmt.Fprint(res, string(respJSON))
		return
	}

	user.Settings = *request
	go user.Save()

	response.Success = true
	response.Settings = user.Settings

	if user.Settings.RecentTracks == false {
		config.DB.Where("user = ?", fmt.Sprint(user.ID)).Delete(userutils.RecentTracks{})
	}

	respJSON, _ := json.Marshal(response)
	fmt.Fprint(res, string(respJSON))
}
