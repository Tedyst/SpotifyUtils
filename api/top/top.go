package top

import (
	"encoding/json"
	"fmt"
	"net/http"

	servertiming "github.com/mitchellh/go-server-timing"
	"github.com/tedyst/spotifyutils/api/utils"
	"github.com/tedyst/spotifyutils/auth"
	"github.com/tedyst/spotifyutils/userutils"
)

// swagger:parameters responseTopAPI
type _ struct {
	// in: body
	// required: true
	Body responseTopAPI
}

type responseTopAPI struct {
	Result  userutils.TopStruct
	Success bool
}

// Handler returns a user's top metrics
// swagger:route GET /top top top
// Produces:
// - application/json
// responses:
//   200: responseTopAPI
//   default: Error
func Handler(res http.ResponseWriter, req *http.Request) {
	response := &responseTopAPI{}
	user := req.Context().Value(auth.UserContextKey{}).(*userutils.User)

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
