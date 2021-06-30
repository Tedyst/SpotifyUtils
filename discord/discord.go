package discord

import (
	"fmt"
	"log"

	"github.com/bwmarrin/discordgo"
	"github.com/sirupsen/logrus"
	"github.com/tedyst/spotifyutils/config"
	"github.com/tedyst/spotifyutils/userutils"
)

var (
	GuildID         = "446365233477320716"
	RemoveCommands  = false
	session         *discordgo.Session
	commandHandlers = map[string]func(s *discordgo.Session, i *discordgo.InteractionCreate){
		"link": linkCommand,
		"top":  topCommand,
	}
	commands = []*discordgo.ApplicationCommand{
		{
			Name:        "link",
			Description: "Link Discord account to SpotifyUtils",
			Options: []*discordgo.ApplicationCommandOption{
				{
					Type:        discordgo.ApplicationCommandOptionBoolean,
					Name:        "public",
					Description: "Enable everyone to see the response",
					Required:    false,
				},
			},
		},
		{
			Name:        "top",
			Description: "Show your top tracks",
			Options: []*discordgo.ApplicationCommandOption{
				{
					Type:        discordgo.ApplicationCommandOptionInteger,
					Name:        "count",
					Description: "The number of tracks/artists/genres to show",
					Required:    false,
				},
				{
					Type:        discordgo.ApplicationCommandOptionBoolean,
					Name:        "public",
					Description: "Enable everyone to see the response",
					Required:    false,
				},
			},
		},
	}
)

func InitBot() {
	discord, err := discordgo.New("Bot " + *config.DiscordBotToken)
	if err != nil {
		logrus.WithFields(logrus.Fields{
			"type": "discord",
		}).Error(err)
	}
	session = discord
	session.AddHandler(func(s *discordgo.Session, r *discordgo.Ready) {
		logrus.WithFields(logrus.Fields{
			"type": "discord",
		}).Info("Connected to Discord")
	})
	err = session.Open()
	if err != nil {
		logrus.WithFields(logrus.Fields{
			"type": "discord",
		}).Error(err)
	}

	if *config.DiscordCreateCommands {
		logrus.WithFields(logrus.Fields{
			"type": "discord",
		}).Debug("Creating Discord Commands")
		for _, v := range commands {
			_, err := session.ApplicationCommandCreate(session.State.User.ID, GuildID, v)
			if err != nil {
				log.Panicf("Cannot create '%v' command: %v", v.Name, err)
			}
		}
	}

	session.AddHandler(func(s *discordgo.Session, i *discordgo.InteractionCreate) {
		if h, ok := commandHandlers[i.Data.Name]; ok {
			h(s, i)
		}
	})
}

func errorInteraction(s *discordgo.Session, i *discordgo.InteractionCreate, err error) {
	embed := &discordgo.MessageEmbed{
		Title:       "An error occured while executing that command",
		Description: fmt.Sprintf("```%s```", err),
		Color:       0x78141b,
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
}

func getUserFromInteraction(i *discordgo.InteractionCreate) (*userutils.User, bool) {
	if i.User != nil {
		return userutils.GetUserFromDiscordID(i.User.ID)
	} else {
		return userutils.GetUserFromDiscordID(i.Member.User.ID)
	}
}
