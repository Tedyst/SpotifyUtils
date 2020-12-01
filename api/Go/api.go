package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func statusAPI(res http.ResponseWriter, req *http.Request) {
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
	if user.DisplayName == "" {
		response.Username = user.ID
	} else {
		response.Username = user.DisplayName
	}

	response.Image = user.Images[0].URL
	for _, s := range user.Playlists {
		playlist := &playlistResponse{
			ID:   string(s.ID),
			Name: s.Name,
		}
		response.Playlists = append(response.Playlists, *playlist)
	}
	respJSON, _ := json.Marshal(response)
	fmt.Fprintf(res, string(respJSON))
}
