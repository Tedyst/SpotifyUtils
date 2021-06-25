package discord

import (
	"fmt"
	"log"

	"github.com/bwmarrin/discordgo"
	"github.com/sirupsen/logrus"
	"github.com/tedyst/spotifyutils/config"
)

var (
	GuildID        = "446365233477320716"
	RemoveCommands = false
	session        *discordgo.Session
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
		log.Println("Bot is up!")
	})
	err = session.Open()
	if err != nil {
		logrus.WithFields(logrus.Fields{
			"type": "discord",
		}).Error(err)
	}

	// for _, v := range commands {
	// 	_, err := session.ApplicationCommandCreate(session.State.User.ID, GuildID, v)
	// 	if err != nil {
	// 		log.Panicf("Cannot create '%v' command: %v", v.Name, err)
	// 	}
	// }

	session.AddHandler(func(s *discordgo.Session, i *discordgo.InteractionCreate) {
		if h, ok := commandHandlers[i.Data.Name]; ok {
			h(s, i)
		}
	})
}

var (
	commands = []*discordgo.ApplicationCommand{
		{
			Name:        "link",
			Description: "Link Discord account to SpotifyUtils",
		},
	}
	commandHandlers = map[string]func(s *discordgo.Session, i *discordgo.InteractionCreate){
		"link": linkCommand,
	}
)

func errorInteractionErr(s *discordgo.Session, i *discordgo.InteractionCreate, err error) {
	s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
		Type: discordgo.InteractionResponseChannelMessageWithSource,
		Data: &discordgo.InteractionApplicationCommandResponseData{
			Flags:   1 << 6,
			Content: fmt.Sprint(err),
		},
	})
}

func errorInteractionString(s *discordgo.Session, i *discordgo.InteractionCreate, err string) {
	s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
		Type: discordgo.InteractionResponseChannelMessageWithSource,
		Data: &discordgo.InteractionApplicationCommandResponseData{
			Flags:   1 << 6,
			Content: err,
		},
	})
}
