package trackapi

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/tedyst/spotifyutils/tracks"

	"github.com/gorilla/mux"
	"github.com/tedyst/spotifyutils/config"
	"github.com/tedyst/spotifyutils/userutils"
)

func Handler(res http.ResponseWriter, req *http.Request) {
	res.Header().Set("Content-Type", "application/json")
	session, _ := config.SessionStore.Get(req, "username")
	vars := mux.Vars(req)
	type Resp struct {
		Result  tracks.Track
		Success bool
		Error   string `json:",omitempty"`
	}
	response := &Resp{}
	if _, ok := session.Values["username"]; !ok {
		response.Success = false
		response.Error = "Not logged in"
		respJSON, _ := json.Marshal(response)
		fmt.Fprint(res, string(respJSON))
		return
	}
	val := session.Values["username"]
	user := userutils.GetUser(val.(string))

	trackURI := vars["track"]
	if len(trackURI) == 36 {
		// If it contains spotify:track:
		trackURI = trackURI[14:]
	}

	tr := tracks.GetTrackFromID(trackURI)
	err := tr.Update(*user.Client())
	if err != nil {
		response.Success = false
		response.Error = fmt.Sprint(err)
		respJSON, _ := json.Marshal(response)
		fmt.Fprint(res, string(respJSON))
		return
	}
	response.Result = *tr
	response.Success = true

	respJSON, _ := json.Marshal(response)
	fmt.Fprint(res, string(respJSON))
}
