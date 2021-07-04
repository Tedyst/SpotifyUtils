package top

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"
	"github.com/tedyst/spotifyutils/api/utils"
	"github.com/tedyst/spotifyutils/userutils"
)

type responseSince struct {
	Result  userutils.RecentTracksStatisticsStruct
	Success bool
}

func HandlerSince(res http.ResponseWriter, req *http.Request, user *userutils.User) {
	response := &responseSince{}
	vars := mux.Vars(req)
	err := user.RefreshTop()
	if err != nil {
		utils.ErrorErr(res, req, err)
		return
	}
	response.Success = true
	date, err := strconv.ParseInt(vars["unixdate"], 10, 32)
	if err != nil {
		utils.ErrorErr(res, req, err)
		return
	}
	response.Result = user.RecentTracksStatistics(time.Unix(date, 0))

	respJSON, _ := json.Marshal(response)
	fmt.Fprint(res, string(respJSON))
}
