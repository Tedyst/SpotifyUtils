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
	ID    string
	Name  string
	Image string
	Code  string
}
type response struct {
	Initiator responseUser
	Target    responseUser
	Result    userutils.CompareStruct
	Success   bool
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
