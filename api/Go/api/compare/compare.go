package compare

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/tedyst/spotifyutils/api/config"
	"github.com/tedyst/spotifyutils/api/userutils"
)

func HandlerUsername(res http.ResponseWriter, req *http.Request) {
	res.Header().Set("Content-Type", "application/json")
	session, _ := config.SessionStore.Get(req, "username")
	vars := mux.Vars(req)
	type RespUser struct {
		ID    string `json:"username"`
		Name  string `json:"name"`
		Image string `json:"image"`
		Code  string `json:"code"`
	}
	type Resp struct {
		Initiator RespUser                `json:"initiator"`
		Target    RespUser                `json:"target"`
		Result    userutils.CompareStruct `json:"result"`
		Success   bool                    `json:"success"`
		Error     string                  `json:"error,omitempty"`
	}

	response := &Resp{}
	if _, ok := session.Values["username"]; !ok {
		response.Success = false
		response.Error = "Not Logged in"
		respJSON, _ := json.Marshal(response)
		fmt.Fprintf(res, string(respJSON))
		return
	}
	if _, ok := vars["code"]; !ok {
		response.Success = false
		response.Error = "No Code Specified"
		respJSON, _ := json.Marshal(response)
		fmt.Fprintf(res, string(respJSON))
		return
	}
	val := session.Values["username"]
	user := userutils.GetUser(val.(string))
	code := vars["code"]
	target := userutils.GetUserFromCompareCode(code)
	if target == nil {
		response.Success = false
		response.Error = "User not found"
		respJSON, _ := json.Marshal(response)
		fmt.Fprintf(res, string(respJSON))
		return
	}

	response.Success = true
	response.Initiator = RespUser{
		ID:   user.ID,
		Code: user.CompareCode,
		Name: user.DisplayName,
	}
	if len(user.Images) > 0 {
		response.Initiator.Image = user.Images[0].URL
	}
	response.Target = RespUser{
		ID:   target.ID,
		Code: target.CompareCode,
		Name: target.DisplayName,
	}
	if len(target.Images) > 0 {
		response.Target.Image = target.Images[0].URL
	}
	response.Result = user.Compare(target)

	respJSON, _ := json.Marshal(response)
	fmt.Fprintf(res, string(respJSON))
}
