package main

import "net/http"

type statusAPIResponse struct {
	Success bool   `json:"success"`
	Error   string `json:"error,omitempty"`
}

func statusAPI(res http.ResponseWriter, req *http.Request) {
	session, _ := sessionStore.Get(req, "username")
	if val, ok := session.Values["username"]; !ok {

	}
}
