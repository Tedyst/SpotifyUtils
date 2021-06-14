package utils

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/tedyst/spotifyutils/config"
	"github.com/tedyst/spotifyutils/userutils"
)

func LoggedIn(f func(res http.ResponseWriter, req *http.Request, user *userutils.User)) http.Handler {
	return http.HandlerFunc(func(res http.ResponseWriter, req *http.Request) {
		res.Header().Set("Content-Type", "application/json")
		session, _ := config.SessionStore.Get(req, "username")
		val, ok := session.Values["username"]
		if !ok {
			res.WriteHeader(401)
			ErrorString(res, req, "Not Logged In")
			return
		}
		switch v := val.(type) {
		case string:
			user := userutils.GetUser(v)
			f(res, req, user)
		default:
			ErrorString(res, req, "Invalid username")
			res.WriteHeader(http.StatusUnauthorized)
		}
	})
}

type responseError struct {
	Success bool
	Error   string
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
