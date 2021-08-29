package compare

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	servertiming "github.com/mitchellh/go-server-timing"
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
	timing := servertiming.FromContext(req.Context())
	getuser := timing.NewMetric("GetComparedUser").Start()
	target := userutils.GetUserFromCompareCode(code)
	getuser.Stop()
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
	compare := timing.NewMetric("Compare").Start()
	response.Result = user.Compare(target)
	compare.Stop()
	go user.AddFriend(target)

	respJSON, err := json.Marshal(response)
	if err != nil {
		utils.ErrorErr(res, req, err)
		return
	}
	fmt.Fprint(res, string(respJSON))
}
