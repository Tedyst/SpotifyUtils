package discord

import (
	"errors"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/tedyst/spotifyutils/config"
	"gorm.io/gorm"
)

type DiscordLinkRequest struct {
	ID        uint           `gorm:"primarykey" json:"-"`
	CreatedAt time.Time      `json:"-"`
	UpdatedAt time.Time      `json:"-"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
	Token     string         `gorm:"unique"`
	DiscordID string         `json:"-"`
}

func GetLinkRequest(token string) (DiscordLinkRequest, error) {
	var req DiscordLinkRequest
	if err := config.DB.Model(&DiscordLinkRequest{}).Where("token = ", token).First(&req).Error; err != nil {
		return DiscordLinkRequest{}, errors.New("link request not found")
	}
	return req, nil
}

func generateNewLinkRequest() string {
	for length := 6; length <= 12; length++ {
		for i := 1; i <= 10; i++ {
			newUUID := uuid.New().String()
			var count int64
			config.DB.Model(&DiscordLinkRequest{}).Where("token = ?", newUUID).Count(&count)
			if count == 0 {
				return strings.ToUpper(newUUID)
			}
		}
	}
	// If this ever happens...
	return ""
}

func CreateLinkRequest(id string) (DiscordLinkRequest, error) {
	token := generateNewLinkRequest()
	if token == "" {
		return DiscordLinkRequest{}, errors.New("could not generate new link token")
	}

	var req DiscordLinkRequest
	var count int64
	config.DB.Model(&DiscordLinkRequest{}).Where("discord_id = ?", id).Count(&count)
	if count != 0 {
		if err := config.DB.Model(&DiscordLinkRequest{}).Where("discord_id = ?", id).First(&req).Error; err != nil {
			return DiscordLinkRequest{}, err
		}
		req.Token = token
		if err := config.DB.Save(req).Error; err != nil {
			return DiscordLinkRequest{}, err
		}
	} else {
		req = DiscordLinkRequest{
			Token:     token,
			DiscordID: id,
		}
		if err := config.DB.Model(&DiscordLinkRequest{}).Create(&req).Error; err != nil {
			return DiscordLinkRequest{}, err
		}
	}

	return req, nil
}

func UseLinkRequest(token string) (DiscordLinkRequest, error) {
	var req DiscordLinkRequest
	var count int64
	config.DB.Model(&DiscordLinkRequest{}).Where("token = ?", token).Count(&count)
	if count == 0 {
		return DiscordLinkRequest{}, errors.New("request not found")
	}

	if err := config.DB.Model(&DiscordLinkRequest{}).Delete(&req).Error; err != nil {
		return DiscordLinkRequest{}, errors.New("could not use request")
	}

	if time.Since(req.CreatedAt) >= time.Hour {
		return DiscordLinkRequest{}, errors.New("request expired")
	}

	return req, nil
}
