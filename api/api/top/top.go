package top

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/tedyst/spotifyutils/api/config"
	"github.com/tedyst/spotifyutils/api/userutils"
)

func TopHandler(res http.ResponseWriter, req *http.Request) {
	res.Header().Set("Content-Type", "application/json")
	session, _ := config.SessionStore.Get(req, "username")
	type Resp struct {
		Result  userutils.TopStruct `json:"result"`
		Success bool                `json:"success"`
		Error   string              `json:"error,omitempty"`
	}
	response := &Resp{}
	if _, ok := session.Values["username"]; !ok {
		response.Success = false
		response.Error = "Not Logged in!"
		respJSON, _ := json.Marshal(response)
		fmt.Fprintf(res, string(respJSON))
		return
	}
	val := session.Values["username"]
	user := userutils.GetUser(val.(string))
	err := user.RefreshTop()
	if err != nil {
		response.Success = false
		response.Error = fmt.Sprint(err)
		respJSON, _ := json.Marshal(response)
		fmt.Fprintf(res, string(respJSON))
		return
	}
	response.Success = true
	response.Result = user.Top

	respJSON, _ := json.Marshal(response)
	fmt.Fprintf(res, string(respJSON))
}

func TopHandlerSince(res http.ResponseWriter, req *http.Request) {
	res.Header().Set("Content-Type", "application/json")
	session, _ := config.SessionStore.Get(req, "username")
	type Resp struct {
		Result  userutils.RecentTracksStatisticsStruct
		Success bool
		Error   string `json:",omitempty"`
	}
	response := &Resp{}
	if _, ok := session.Values["username"]; !ok {
		response.Success = false
		response.Error = "Not Logged in!"
		respJSON, _ := json.Marshal(response)
		fmt.Fprintf(res, string(respJSON))
		return
	}
	val := session.Values["username"]
	user := userutils.GetUser(val.(string))
	err := user.RefreshTop()
	if err != nil {
		response.Success = false
		response.Error = fmt.Sprint(err)
		respJSON, _ := json.Marshal(response)
		fmt.Fprintf(res, string(respJSON))
		return
	}
	response.Success = true
	response.Result = user.RecentTracksStatistics(time.Now().Add(-600 * time.Hour))

	respJSON, _ := json.Marshal(response)
	fmt.Fprintf(res, string(respJSON))
}
