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
		ID:    user.UserID,
		Code:  user.CompareCode,
		Name:  user.DisplayName,
		Image: user.GetImageURL(),
	}
	response.Target = RespUser{
		ID:    target.UserID,
		Code:  target.CompareCode,
		Name:  target.DisplayName,
		Image: target.GetImageURL(),
	}
	response.Result = user.Compare(target)
	user.AddFriend(target)

	respJSON, _ := json.Marshal(response)
	fmt.Fprintf(res, string(respJSON))
}

func HandlerNoUsername(res http.ResponseWriter, req *http.Request) {
	res.Header().Set("Content-Type", "application/json")
	session, _ := config.SessionStore.Get(req, "username")
	type RespUser struct {
		ID    string `json:"username"`
		Name  string `json:"name"`
		Image string `json:"image"`
		Code  string `json:"code"`
	}
	type Resp struct {
		Friends []RespUser `json:"friends"`
		Success bool       `json:"success"`
		Error   string     `json:"error,omitempty"`
		Code    string     `json:"code"`
	}

	response := &Resp{}
	if _, ok := session.Values["username"]; !ok {
		response.Success = false
		response.Error = "Not Logged in"
		respJSON, _ := json.Marshal(response)
		fmt.Fprintf(res, string(respJSON))
		return
	}
	val := session.Values["username"]
	user := userutils.GetUser(val.(string))

	for _, s := range user.GetFriends() {
		response.Friends = append(response.Friends, RespUser{
			Code:  s.CompareCode,
			ID:    s.UserID,
			Name:  s.DisplayName,
			Image: s.GetImageURL(),
		})
	}
	response.Success = true
	response.Code = user.CompareCode

	respJSON, _ := json.Marshal(response)
	fmt.Fprintf(res, string(respJSON))
}
