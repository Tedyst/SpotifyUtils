package admin

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	"github.com/tedyst/spotifyutils/api/userutils"

	"github.com/tedyst/spotifyutils/api/config"
)

func verifyIfAdmin(res http.ResponseWriter, req *http.Request) error {
	session, _ := config.SessionStore.Get(req, "username")
	type responseStruct struct {
		Success bool   `json:"success"`
		Error   string `json:"error,omitempty"`
	}
	response := &responseStruct{}
	if _, ok := session.Values["username"]; !ok {
		res.Header().Set("Content-Type", "application/json")
		response.Success = false
		response.Error = "Not Logged in"
		respJSON, _ := json.Marshal(response)
		fmt.Fprintf(res, string(respJSON))
		return errors.New("Not Logged in")
	}
	if session.Values["username"].(string) != *config.Admin {
		res.Header().Set("Content-Type", "application/json")
		response.Success = false
		response.Error = "Not Allowed"
		respJSON, _ := json.Marshal(response)
		fmt.Fprintf(res, string(respJSON))
		return errors.New("Not Allowed")
	}
	return nil
}

func Admin(res http.ResponseWriter, req *http.Request) {
	err := verifyIfAdmin(res, req)
	if err != nil {
		return
	}
}

func DeleteAllUserTokens(res http.ResponseWriter, req *http.Request) {
	err := verifyIfAdmin(res, req)
	if err != nil {
		return
	}
	userutils.DeleteAllTokens()
}
