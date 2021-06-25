package discord

import (
	"fmt"

	"github.com/bwmarrin/discordgo"
	"github.com/tedyst/spotifyutils/config"
)

func linkCommand(s *discordgo.Session, i *discordgo.InteractionCreate) {
	var request DiscordLinkRequest
	var err error
	if i.User != nil {
		request, err = CreateLinkRequest(i.User.ID)

	} else {
		request, err = CreateLinkRequest(i.Member.User.ID)
	}
	if err != nil {
		errorInteractionErr(s, i, err)
	}

	embed := &discordgo.MessageEmbed{
		Title:       "Click here to link your Discord account",
		URL:         fmt.Sprintf("%s/discord/%s", *config.BaseURL, request.Token),
		Description: "You need to click here and login using your Spotify account to use the bot",
		Color:       0x78141b,
		// Fields: []*discordgo.MessageEmbedField{
		// 	{
		// 		Name:   "Request token",
		// 		Value:  request.Token,
		// 		Inline: true,
		// 	},
		// 	{
		// 		Name:   "Req ID",
		// 		Value:  fmt.Sprint(request.ID),
		// 		Inline: true,
		// 	},
		// 	{
		// 		Name:   "Req DiscordID",
		// 		Value:  fmt.Sprint(request.DiscordID),
		// 		Inline: false,
		// 	},
		// },
	}

	s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
		Type: discordgo.InteractionResponseChannelMessageWithSource,
		Data: &discordgo.InteractionApplicationCommandResponseData{
			Embeds: []*discordgo.MessageEmbed{
				embed,
			},
			Content: "",
			Flags:   1 << 6,
		},
	})

	// s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
	// 	Type: discordgo.InteractionResponseChannelMessageWithSource,
	// 	Data: &discordgo.InteractionApplicationCommandResponseData{
	// 		Flags:   1 << 6,
	// 		Content: fmt.Sprint(),
	// 	},
	// })
}
