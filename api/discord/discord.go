package playlistview

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/tedyst/spotifyutils/api/utils"
	"github.com/tedyst/spotifyutils/discord"

	"github.com/tedyst/spotifyutils/userutils"
)

type response struct {
	Success bool
}

type request struct {
	Token string
}

func Handler(res http.ResponseWriter, req *http.Request, user *userutils.User) {
	if req.Method != "POST" {
		utils.ErrorString(res, req, "Method not allowed")
		return
	}

	r := response{
		Success: true,
	}
	request := &request{}
	decoder := json.NewDecoder(req.Body)
	err := decoder.Decode(request)
	if err != nil {
		utils.ErrorErr(res, req, err)
		return
	}

	discordReq, err := discord.UseLinkRequest(request.Token)
	if err != nil {
		utils.ErrorErr(res, req, err)
		return
	}

	user.DiscordID = discordReq.DiscordID
	go user.Save()

	respJSON, _ := json.Marshal(r)
	fmt.Fprint(res, string(respJSON))
}
