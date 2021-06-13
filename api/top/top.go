package top

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/tedyst/spotifyutils/api/utils"
	"github.com/tedyst/spotifyutils/userutils"
)

type responseNormal struct {
	Result  userutils.TopStruct `json:"result"`
	Success bool                `json:"success"`
	Error   string              `json:"error,omitempty"`
}

func Handler(res http.ResponseWriter, req *http.Request, user *userutils.User) {
	response := &responseNormal{}
	err := user.RefreshTop()
	if err != nil {
		utils.ErrorErr(res, req, err)
		return
	}
	response.Success = true
	response.Result = user.Top

	respJSON, _ := json.Marshal(response)
	fmt.Fprint(res, string(respJSON))
}
