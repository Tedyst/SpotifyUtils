package top

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"
	servertiming "github.com/mitchellh/go-server-timing"
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
	timing := servertiming.FromContext(req.Context())
	refreshtop := timing.NewMetric("RefreshTop").Start()
	err := user.RefreshTop()
	refreshtop.Stop()
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
	getstats := timing.NewMetric("GetStatisticsFromDB").Start()
	response.Result = user.RecentTracksStatistics(time.Unix(date, 0))
	getstats.Stop()

	respJSON, _ := json.Marshal(response)
	fmt.Fprint(res, string(respJSON))
}
