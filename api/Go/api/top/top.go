package top

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/tedyst/spotifyutils/api/config"
	"github.com/tedyst/spotifyutils/api/userutils"
)

func TopHandler(res http.ResponseWriter, req *http.Request) {
	type playlistResponse struct {
		ID     string   `json:"id,omitempty"`
		Name   string   `json:"name,omitempty"`
		Tracks []string `json:"tracks,omitempty"`
	}
	type statusAPIResponse struct {
		Success   bool               `json:"success"`
		Error     string             `json:"error,omitempty"`
		Username  string             `json:"username,omitempty"`
		Image     string             `json:"image,omitempty"`
		Playlists []playlistResponse `json:"playlists,omitempty"`
	}
	res.Header().Set("Content-Type", "application/json")
	session, _ := config.SessionStore.Get(req, "username")
	response := &statusAPIResponse{}
	if _, ok := session.Values["username"]; !ok {
		response.Success = false
		response.Error = "Not Logged in!"
		respJSON, _ := json.Marshal(response)
		fmt.Fprintf(res, string(respJSON))
		return
	}
	val := session.Values["username"]
	user := userutils.GetUser(val.(string))
	user.Top()
	respJSON, _ := json.Marshal(response)
	fmt.Fprintf(res, string(respJSON))
}
