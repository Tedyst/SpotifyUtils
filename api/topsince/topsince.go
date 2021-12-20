package topsince

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

// swagger:response topSinceAPIResponse
type _ struct {
	// in: body
	Body topSinceAPIResponse
}

type topSinceAPIResponse struct {
	Success bool
	Result  userutils.RecentTracksStatisticsStruct
}

// swagger:parameters topSinceAPIRequest
type _ struct {
	// in: path
	// required: true
	Date int32
}

// Handler returns a user's top metrics from a specified date
// swagger:route GET /top/old/{Date} top topSinceAPIRequest
// Produces:
// - application/json
// responses:
//   200: topSinceAPIResponse
//   default: Error
func Handler(res http.ResponseWriter, req *http.Request, user *userutils.User) {
	response := &topSinceAPIResponse{}
	if !user.Settings.RecentTracks {
		utils.ErrorString(res, req, "recent tracks tracking is disabled")
		return
	}

	vars := mux.Vars(req)
	timing := servertiming.FromContext(req.Context())
	response.Success = true
	date, err := strconv.ParseInt(vars["unixdate"], 10, 32)
	if err != nil {
		utils.ErrorErr(res, req, err)
		return
	}
	getstats := timing.NewMetric("GetStatisticsFromDB").Start()
	response.Result = user.RecentTracksStatistics(time.Unix(date, 0))
	getstats.Stop()

	respJSON, err := json.Marshal(response)
	if err != nil {
		utils.ErrorErr(res, req, err)
		return
	}
	fmt.Fprint(res, string(respJSON))
}
