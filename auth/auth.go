package auth

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path"

	log "github.com/sirupsen/logrus"
	"github.com/tedyst/spotifyutils/api/utils"
	"github.com/tedyst/spotifyutils/config"
	"github.com/tedyst/spotifyutils/spotifywrapper"
	"github.com/tedyst/spotifyutils/userutils"
	utils2 "github.com/tedyst/spotifyutils/utils"
)

// swagger:response authAPIResponse
type authAPIResponse struct {
	// The state of the authentication
	Success bool
}

// swagger:parameters authAPIRequest
type _ struct {
	// in: body
	Body authAPIRequest
}

type authAPIRequest struct {
	// The host of the request
	// required: true
	// example: https://localhost:8080
	Host string
	// The code of the request
	// example: asd
	// required: true
	Code string
}

// Auth performs the authentication of users
// swagger:route POST /auth auth authAPIRequest
// Consumes:
// - application/json
// Produces:
// - application/json
// responses:
//   200: authAPIResponse
//   default: Error
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
					"code": utils2.StringSanitize(request.Code),
					"host": utils2.StringSanitize(request.Host),
				}).Error(err)
				utils.ErrorErr(res, req, err)
				return
			}
			client := config.SpotifyAPI.NewClient(token)
			spotifyUser, err := client.CurrentUser()
			if err != nil {
				log.WithFields(log.Fields{
					"type": "auth",
					"code": utils2.StringSanitize(request.Code),
					"host": utils2.StringSanitize(request.Host),
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
			"code": utils2.StringSanitize(request.Code),
			"host": utils2.StringSanitize(request.Host),
		}).Error(err)
		utils.ErrorErr(res, req, err)
		return
	}

	response.Success = true
	respJSON, _ := json.Marshal(response)
	fmt.Fprint(res, string(respJSON))
}

// swagger:parameters authURLAPIRequest
type _ struct {
	// in: query
	// example: spotify.tedyst.ro
	Host string `json:"host"`
}

// swagger:response authURLAPIResponse
type authURLAPIResponse struct {
	// The state of the response
	// example: true
	Success bool
	// The URL where the user needs to login
	// example: https://spotify.com/oauth2?asd
	URL string
}

// AuthURL generates the OAuth2 url needed to login
// swagger:route GET /auth-url auth authURLAPIRequest
// Consumes:
// - application/json
// Produces:
// - application/json
// responses:
//   200: authURLAPIResponse
//   default: Error
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
// swagger:route GET /logout auth logout
// Consumes:
// - application/json
// Produces:
// - application/json
// responses:
//   200: authAPIResponse
//   default: Error
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
	index := path.Join(*config.BuildPath, "index.html")
	if _, err := os.Stat(index); err != nil {
		return
	}
	http.ServeFile(res, req, index)
}
