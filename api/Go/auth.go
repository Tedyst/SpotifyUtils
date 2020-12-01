package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gorilla/sessions"
)

var sessionStore = sessions.NewCookieStore([]byte(secret))

func authAPI(res http.ResponseWriter, req *http.Request) {
	type authAPIResponse struct {
		Success bool   `json:"success"`
		Error   string `json:"error,omitempty"`
		URL     string
	}
	type authAPIRequest struct {
		Host string `json:"host"`
		Code string `json:"code"`
	}
	res.Header().Set("Content-Type", "application/json")
	response := &authAPIResponse{}
	if req.Method != "POST" {
		response.Error = "Invalid Method"
		response.Success = false
		respJSON, _ := json.Marshal(response)
		fmt.Fprintf(res, string(respJSON))
		return
	}

	request := &authAPIRequest{}
	decoder := json.NewDecoder(req.Body)
	err := decoder.Decode(request)
	if err != nil || request.Host == "" || request.Code == "" {
		response.Error = "Invalid Request"
		response.Success = false
		respJSON, _ := json.Marshal(response)
		fmt.Fprintf(res, string(respJSON))
		return
	}

	token, err := getSpotifyAuthorization(request.Host, request.Code)
	if err != nil {
		response.Error = fmt.Sprint(err)
		response.Success = false
		respJSON, _ := json.Marshal(response)
		fmt.Fprintf(res, string(respJSON))
		return
	}

	client := spotifyAPI.NewClient(token)
	spotifyUser, err := client.CurrentUser()
	if err != nil {
		response.Error = fmt.Sprint(err)
		response.Success = false
		respJSON, _ := json.Marshal(response)
		fmt.Fprintf(res, string(respJSON))
		return
	}
	user := getUser(spotifyUser.ID)
	user.Token = token
	user.DisplayName = spotifyUser.DisplayName
	user.ID = spotifyUser.ID
	user.Images = spotifyUser.Images
	addUser(user)
	user.refreshUser()

	session, _ := sessionStore.Get(req, "username")
	session.Values["username"] = user.ID
	session.Save(req, res)

	response.Success = true
	respJSON, _ := json.Marshal(response)
	fmt.Fprint(res, string(respJSON))
}

func authURLAPI(res http.ResponseWriter, req *http.Request) {
	type authURLAPIResponse struct {
		Success bool   `json:"success"`
		Error   string `json:"error,omitempty"`
		URL     string `json:",omitempty"`
	}
	type authURLAPIRequest struct {
		Host string `json:"host"`
	}
	res.Header().Set("Content-Type", "application/json")
	response := &authURLAPIResponse{
		Success: false,
		Error:   "Invalid Request",
	}
	request := &authURLAPIRequest{}
	decoder := json.NewDecoder(req.Body)
	err := decoder.Decode(request)
	if err != nil || request.Host == "" {
		respJSON, _ := json.Marshal(response)
		fmt.Fprintf(res, string(respJSON))
		return
	}
	response.URL = getSpotifyURL(request.Host)
	response.Success = true
	response.Error = ""
	respJSON, _ := json.Marshal(response)
	fmt.Fprint(res, string(respJSON))
}
