package auth

import (
	"encoding/json"
	"fmt"
	"net/http"

	log "github.com/sirupsen/logrus"
	"github.com/tedyst/spotifyutils/api/utils"
	"github.com/tedyst/spotifyutils/config"
	"github.com/tedyst/spotifyutils/spotifywrapper"
	"github.com/tedyst/spotifyutils/userutils"
)

type authAPIResponse struct {
	Success bool
}
type authAPIRequest struct {
	Host string
	Code string
}

type authURLAPIResponse struct {
	Success bool
	URL     string
}

// Auth performs the authentication of users
func Auth(res http.ResponseWriter, req *http.Request) {
	res.Header().Set("Content-Type", "application/json")
	response := &authAPIResponse{}
	if req.Method != "POST" {
		utils.ErrorString(res, req, "Invalid Method")
		return
	}

	session, err := config.SessionStore.Get(req, "username")
	if err != nil {
		utils.ErrorErr(res, req, err)
		return
	}

	request := &authAPIRequest{}
	decoder := json.NewDecoder(req.Body)
	err = decoder.Decode(request)
	if err != nil || request.Host == "" || request.Code == "" {
		utils.ErrorString(res, req, "Invalid Request")
		return
	}

	var u *userutils.User
	if *config.MockExternalCalls {
		if *config.MockUser == "" {
			utils.ErrorString(res, req, "MockExternalCalls is enabled but MockUser is not set")
			return
		}
		u = userutils.GetUser(*config.MockUser)
	} else {
		val, ok := session.Values["username"]
		if ok {
			u = userutils.GetUser(val.(string))
		} else {
			token, err := spotifywrapper.GetSpotifyAuthorization(request.Host, request.Code)
			if err != nil {
				log.WithFields(log.Fields{
					"type": "auth",
					"code": request.Code,
					"host": request.Host,
				}).Error(err)
				utils.ErrorErr(res, req, err)
				return
			}
			client := config.SpotifyAPI.NewClient(token)
			spotifyUser, err := client.CurrentUser()
			if err != nil {
				log.WithFields(log.Fields{
					"type": "auth",
					"code": request.Code,
					"host": request.Host,
				}).Error(err)
				utils.ErrorErr(res, req, err)
				return
			}
			u = userutils.GetUser(spotifyUser.ID)
			u.Token = token
			u.DisplayName = spotifyUser.DisplayName
			u.UserID = spotifyUser.ID
			if len(spotifyUser.Images) > 0 {
				u.Image = spotifyUser.Images[0].URL
			}
		}
	}

	u.RefreshUser()
	u.Save()

	go userutils.UpdateUserCount()

	session.Values["username"] = u.UserID

	err = session.Save(req, res)
	if err != nil {
		log.WithFields(log.Fields{
			"type": "auth",
			"code": request.Code,
			"host": request.Host,
		}).Error(err)
		utils.ErrorErr(res, req, err)
		return
	}

	response.Success = true
	respJSON, _ := json.Marshal(response)
	fmt.Fprint(res, string(respJSON))
}

// AuthURL generates the OAuth2 url needed to login
func AuthURL(res http.ResponseWriter, req *http.Request) {
	res.Header().Set("Content-Type", "application/json")
	response := &authURLAPIResponse{
		Success: true,
	}
	host := req.URL.Query().Get("host")
	if host == "" {
		utils.ErrorString(res, req, "Invalid Request")
		return
	}

	if *config.MockExternalCalls {
		response.URL = fmt.Sprintf("%s/auth?code=asd", host)
	} else {
		response.URL = spotifywrapper.GetSpotifyURL(host)
	}

	respJSON, _ := json.Marshal(response)
	fmt.Fprint(res, string(respJSON))
}

// Logout performs the logout of the users
func Logout(res http.ResponseWriter, req *http.Request) {
	session, err := config.SessionStore.Get(req, "username")
	if err != nil {
		utils.ErrorErr(res, req, err)
		return
	}

	session.Values["username"] = ""
	session.Options.MaxAge = -1

	err = session.Save(req, res)
	if err != nil {
		utils.ErrorErr(res, req, err)
		return
	}

	http.ServeFile(res, req, *config.BuildPath+"/index.html")
}
