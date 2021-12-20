package utils

import (
	"encoding/json"
	"fmt"
	"net/http"

	servertiming "github.com/mitchellh/go-server-timing"
	"github.com/tedyst/spotifyutils/config"
	"github.com/tedyst/spotifyutils/userutils"
)

func LoggedIn(f func(res http.ResponseWriter, req *http.Request, user *userutils.User)) http.Handler {
	return http.HandlerFunc(func(res http.ResponseWriter, req *http.Request) {
		res.Header().Set("Content-Type", "application/json")
		timing := servertiming.FromContext(req.Context())
		getfromsession := timing.NewMetric("GetFromSession").Start()
		session, _ := config.SessionStore.Get(req, "username")
		val, ok := session.Values["username"]
		getfromsession.Stop()
		if !ok {
			res.WriteHeader(401)
			ErrorString(res, req, "Not Logged In")
			return
		}
		switch v := val.(type) {
		case string:
			getuser := timing.NewMetric("GetUser").Start()
			user := userutils.GetUser(v)
			getuser.Stop()
			f(res, req, user)
		default:
			ErrorString(res, req, "Invalid username")
			res.WriteHeader(http.StatusUnauthorized)
		}
	})
}

// swagger:response Error
type responseError struct {
	// The state of the response
	// example: false
	Success bool
	// The error message
	// example: Error
	Error string
}

func ErrorString(res http.ResponseWriter, req *http.Request, err string) {
	res.WriteHeader(http.StatusBadRequest)
	response := &responseError{}
	response.Success = false
	response.Error = err
	respJSON, _ := json.Marshal(response)
	fmt.Fprint(res, string(respJSON))
}

func ErrorErr(res http.ResponseWriter, req *http.Request, err error) {
	res.WriteHeader(http.StatusBadRequest)
	response := &responseError{}
	response.Success = false
	response.Error = fmt.Sprint(err)
	respJSON, _ := json.Marshal(response)
	fmt.Fprint(res, string(respJSON))
}
