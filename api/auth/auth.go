package auth

import (
	"encoding/json"
	"fmt"
	"net/http"

	log "github.com/sirupsen/logrus"
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
		log.WithFields(log.Fields{
			"error": err,
			"code":  request.Code,
			"host":  request.Host,
		}).Error("Cannot get authorization from code")
		response.Error = fmt.Sprint(err)
		response.Success = false
		respJSON, _ := json.Marshal(response)
		fmt.Fprintf(res, string(respJSON))
		return
	}

	client := config.SpotifyAPI.NewClient(token)
	spotifyUser, err := client.CurrentUser()
	if err != nil {
		log.Error(err)
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
	if len(spotifyUser.Images) > 0 {
		u.Image = spotifyUser.Images[0].URL
	}

	u.RefreshUser()
	u.Save()

	session, _ := config.SessionStore.Get(req, "username")
	session.Values["username"] = u.UserID

	err = session.Save(req, res)
	if err != nil {
		log.Error(err)
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

func Logout(w http.ResponseWriter, r *http.Request) {
	session, err := config.SessionStore.Get(r, "username")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	session.Values["username"] = ""
	session.Options.MaxAge = -1

	err = session.Save(r, w)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	http.Redirect(w, r, "/", http.StatusFound)
}