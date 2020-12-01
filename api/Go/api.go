package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type statusAPIResponse struct {
	Success   bool     `json:"success"`
	Error     string   `json:"error,omitempty"`
	Username  string   `json:"username,omitempty"`
	Image     string   `json:"image,omitempty"`
	Playlists []string `json:"playlists,omitempty"`
}

func statusAPI(res http.ResponseWriter, req *http.Request) {
	res.Header().Set("Content-Type", "application/json")
	session, _ := sessionStore.Get(req, "username")
	response := &statusAPIResponse{}
	if _, ok := session.Values["username"]; !ok {
		response.Success = false
		response.Error = "Not Logged in!"
		respJSON, _ := json.Marshal(response)
		fmt.Fprintf(res, string(respJSON))
		return
	}
	val := session.Values["username"]
	user := getUser(val.(string))
	user.refreshUser()

	response.Success = true
	response.Image = user.Images[0].URL
	for _, s := range user.Playlists {
		response.Playlists = append(response.Playlists, string(s.ID))
	}
	respJSON, _ := json.Marshal(response)
	fmt.Fprintf(res, string(respJSON))
}
