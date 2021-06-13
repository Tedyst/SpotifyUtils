package compare

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/tedyst/spotifyutils/userutils"
)

type responseUserNoUsername struct {
	ID    string `json:"username"`
	Name  string `json:"name"`
	Image string `json:"image"`
	Code  string `json:"code"`
}
type responseNoUsername struct {
	Friends []responseUserNoUsername `json:"friends"`
	Success bool                     `json:"success"`
	Error   string                   `json:"error,omitempty"`
	Code    string                   `json:"code"`
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

	respJSON, _ := json.Marshal(response)
	fmt.Fprint(res, string(respJSON))
}
