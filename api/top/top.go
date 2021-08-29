package top

import (
	"encoding/json"
	"fmt"
	"net/http"

	servertiming "github.com/mitchellh/go-server-timing"
	"github.com/tedyst/spotifyutils/api/utils"
	"github.com/tedyst/spotifyutils/userutils"
)

type responseNormal struct {
	Result  userutils.TopStruct
	Success bool
}

func Handler(res http.ResponseWriter, req *http.Request, user *userutils.User) {
	response := &responseNormal{}
	timing := servertiming.FromContext(req.Context())
	refreshtop := timing.NewMetric("RefreshTop").Start()
	err := user.RefreshTop()
	refreshtop.Stop()
	if err != nil {
		utils.ErrorErr(res, req, err)
		return
	}
	response.Success = true
	response.Result = user.Top

	respJSON, err := json.Marshal(response)
	if err != nil {
		utils.ErrorErr(res, req, err)
		return
	}
	fmt.Fprint(res, string(respJSON))
}
