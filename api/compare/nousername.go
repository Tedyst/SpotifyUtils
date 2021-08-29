package compare

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/tedyst/spotifyutils/api/utils"
	"github.com/tedyst/spotifyutils/userutils"
)

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

func HandlerNoUsername(res http.ResponseWriter, req *http.Request, user *userutils.User) {
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
