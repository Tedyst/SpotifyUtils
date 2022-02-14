package comparenousername

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/tedyst/spotifyutils/api/utils"
	"github.com/tedyst/spotifyutils/auth"
	"github.com/tedyst/spotifyutils/userutils"
)

// swagger:response compareNoUsernameResponse
type _ struct {
	// in: body
	Body responseNoUsername
}
type responseUserNoUsername struct {
	ID    string
	Name  string
	Image string
	Code  string
}
type responseNoUsername struct {
	Friends []responseUserNoUsername
	Success bool
	Code    string
}

// Handler returns the user's compare information
// swagger:route GET /compare compare compare
// Produces:
// - application/json
// responses:
//   200: compareNoUsernameResponse
//   default: Error
func Handler(res http.ResponseWriter, req *http.Request) {
	user := req.Context().Value(auth.UserContextKey{}).(*userutils.User)
	response := &responseNoUsername{}
	response.Friends = []responseUserNoUsername{}

	for _, s := range user.GetFriends() {
		response.Friends = append(response.Friends, responseUserNoUsername{
			Code:  s.CompareCode,
			ID:    s.UserID,
			Name:  s.DisplayName,
			Image: s.Image,
		})
	}
	response.Success = true
	response.Code = user.CompareCode

	respJSON, err := json.Marshal(response)
	if err != nil {
		utils.ErrorErr(res, req, err)
		return
	}
	fmt.Fprint(res, string(respJSON))
}
