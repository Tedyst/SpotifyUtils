package discord

import (
	"fmt"
	"log"

	"github.com/bwmarrin/discordgo"
	"github.com/sirupsen/logrus"
	"github.com/tedyst/spotifyutils/config"
)

var (
	GuildID         = "446365233477320716"
	RemoveCommands  = false
	session         *discordgo.Session
	commandHandlers = map[string]func(s *discordgo.Session, i *discordgo.InteractionCreate){
		"link": linkCommand,
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
