package discord

import (
	"errors"
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
		errorInteraction(s, i, err)
	}

	embed := &discordgo.MessageEmbed{
		Title:       "Click here to link your Discord account",
		URL:         fmt.Sprintf("%s/discord/%s", *config.BaseURL, request.Token),
		Description: "You need to click here and login using your Spotify account to use the bot.\nThe link request is valid for 1 hour only.",
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

	var flags uint64
	flags = 1 << 6
	if len(i.Data.Options) >= 1 {
		if i.Data.Options[0].BoolValue() {
			flags = 0
		}
	}
	s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
		Type: discordgo.InteractionResponseChannelMessageWithSource,
		Data: &discordgo.InteractionApplicationCommandResponseData{
			Embeds: []*discordgo.MessageEmbed{
				embed,
			},
			Content: "",
			Flags:   flags,
		},
	})
}

func topCommand(s *discordgo.Session, i *discordgo.InteractionCreate) {
	user, ok := getUserFromInteraction(i)
	if !ok {
		errorInteraction(s, i, errors.New("you are not linked to a SpotifyUtils account"))
	}

	var flags uint64
	flags = 1 << 6
	if len(i.Data.Options) >= 2 {
		if i.Data.Options[1].BoolValue() {
			flags = 0
		}
	}

	count := 5
	if len(i.Data.Options) >= 1 {
		count = int(i.Data.Options[0].IntValue())
	}

	embed := &discordgo.MessageEmbed{
		Title:       "Your top artists and tracks",
		URL:         fmt.Sprintf("%s/top", *config.BaseURL),
		Description: "Get ready to feel cool. Or much less cool than you thought",
		Color:       0x78141b,
		Fields: []*discordgo.MessageEmbedField{
			{
				Name:   "Top Artists",
				Value:  user.Top.Artists.StringFirst(count),
				Inline: true,
			},
			{
				Name:   "Top Tracks",
				Value:  user.Top.Tracks.StringFirst(count),
				Inline: true,
			},
			{
				Name:   "Top Genres",
				Value:  user.Top.Genres.StringFirst(count),
				Inline: true,
			},
		},
		Thumbnail: &discordgo.MessageEmbedThumbnail{
			URL: user.Top.Artists[0].Image,
		},
	}

	s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
		Type: discordgo.InteractionResponseChannelMessageWithSource,
		Data: &discordgo.InteractionApplicationCommandResponseData{
			Embeds: []*discordgo.MessageEmbed{
				embed,
			},
			Content: "",
			Flags:   flags,
		},
	})
}
