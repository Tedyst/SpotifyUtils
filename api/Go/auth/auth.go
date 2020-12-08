package auth

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/tedyst/spotifyutils/api/logging"

	"github.com/tedyst/spotifyutils/api/config"
	"github.com/tedyst/spotifyutils/api/spotifywrapper"
	"github.com/tedyst/spotifyutils/api/userutils"
)

func Auth(res http.ResponseWriter, req *http.Request) {
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

	token, err := spotifywrapper.GetSpotifyAuthorization(request.Host, request.Code)
	if err != nil {
		response.Error = fmt.Sprint(err)
		response.Success = false
		respJSON, _ := json.Marshal(response)
		fmt.Fprintf(res, string(respJSON))
		return
	}

	client := config.SpotifyAPI.NewClient(token)
	spotifyUser, err := client.CurrentUser()
	if err != nil {
		logging.ReportError("/auth", err)
		response.Error = fmt.Sprint(err)
		response.Success = false
		respJSON, _ := json.Marshal(response)
		fmt.Fprintf(res, string(respJSON))
		return
	}
	u := userutils.GetUser(spotifyUser.ID)
	u.Token = token
	u.DisplayName = spotifyUser.DisplayName
	u.UserID = spotifyUser.ID
	u.Images = spotifyUser.Images

	u.RefreshUser()
	u.Save()

	session, _ := config.SessionStore.Get(req, "username")
	session.Values["username"] = u.ID

	err = session.Save(req, res)
	if err != nil {
		logging.ReportError("/auth", err)
		response.Error = fmt.Sprint(err)
		response.Success = false
		respJSON, _ := json.Marshal(response)
		fmt.Fprintf(res, string(respJSON))
		return
	}

	response.Success = true
	respJSON, _ := json.Marshal(response)
	fmt.Fprint(res, string(respJSON))
}

func AuthURL(res http.ResponseWriter, req *http.Request) {
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
	response.URL = spotifywrapper.GetSpotifyURL(request.Host)
	response.Success = true
	response.Error = ""
	respJSON, _ := json.Marshal(response)
	fmt.Fprint(res, string(respJSON))
}
