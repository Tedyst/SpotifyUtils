package utils

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/tedyst/spotifyutils/config"
)

func LoggedIn(f func(res http.ResponseWriter, req *http.Request, username string)) http.Handler {
	return http.HandlerFunc(func(res http.ResponseWriter, req *http.Request) {
		res.Header().Set("Content-Type", "application/json")
		session, _ := config.SessionStore.Get(req, "username")
		if _, ok := session.Values["username"]; ok {
			ErrorString(res, req, "Not Logged In")
			return
		}
		val := session.Values["username"]
		switch v := val.(type) {
		case string:
			f(res, req, v)
		default:
			ErrorString(res, req, "Invalid username")
		}
	})
}

func ErrorString(res http.ResponseWriter, req *http.Request, err string) {
	type Response struct {
		Success bool
		Error   string `json:",omitempty"`
	}
	response := &Response{}
	response.Success = false
	response.Error = err
	respJSON, _ := json.Marshal(response)
	fmt.Fprint(res, string(respJSON))
}

func ErrorErr(res http.ResponseWriter, req *http.Request, err error) {
	type Response struct {
		Success bool
		Error   string `json:",omitempty"`
	}
	response := &Response{}
	response.Success = false
	response.Error = fmt.Sprint(err)
	respJSON, _ := json.Marshal(response)
	fmt.Fprint(res, string(respJSON))
}
