package compare

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/tedyst/spotifyutils/api/utils"
	"github.com/tedyst/spotifyutils/userutils"
)

type responseUser struct {
	ID    string `json:"username"`
	Name  string `json:"name"`
	Image string `json:"image"`
	Code  string `json:"code"`
}
type response struct {
	Initiator responseUser            `json:"initiator"`
	Target    responseUser            `json:"target"`
	Result    userutils.CompareStruct `json:"result"`
	Success   bool                    `json:"success"`
	Error     string                  `json:"error,omitempty"`
}

func HandlerUsername(res http.ResponseWriter, req *http.Request, user *userutils.User) {
	vars := mux.Vars(req)
	response := &response{}
	if _, ok := vars["code"]; !ok {
		utils.ErrorString(res, req, "No code specified")
		return
	}
	code := vars["code"]
	target := userutils.GetUserFromCompareCode(code)
	if target == nil {
		utils.ErrorString(res, req, "User not found")
		return
	}

	response.Success = true
	response.Initiator = responseUser{
		ID:    user.UserID,
		Code:  user.CompareCode,
		Name:  user.DisplayName,
		Image: user.Image,
	}
	response.Target = responseUser{
		ID:    target.UserID,
		Code:  target.CompareCode,
		Name:  target.DisplayName,
		Image: target.Image,
	}
	response.Result = user.Compare(target)
	go user.AddFriend(target)

	respJSON, _ := json.Marshal(response)
	fmt.Fprint(res, string(respJSON))
}
