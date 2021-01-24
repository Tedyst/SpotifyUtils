package tracks

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"fmt"

	log "github.com/sirupsen/logrus"
	"github.com/tedyst/spotifyutils/config"
	"github.com/zmb3/spotify"
	"gorm.io/gorm"
)

type Artist struct {
	gorm.Model
	ArtistID   string `gorm:"type:VARCHAR(30) NOT NULL UNIQUE"`
	Name       string
	Genres     GenresStruct
	Popularity int16
	Image      string
}

type GenresStruct []string

func (sla *GenresStruct) Scan(value interface{}) error {
	switch v := value.(type) {
	case []byte:
		log.Tracef("Using []byte as type, value %v", v)
		return json.Unmarshal(value.([]byte), &sla)
	case string:
		log.Tracef("Using string as type, value %v", v)
		return json.Unmarshal([]byte(value.(string)), &sla)
	default:
		log.Panic("Not found interface type")
	}
	return nil
}

func (sla GenresStruct) Value() (driver.Value, error) {
	val, err := json.Marshal(sla)
	return string(val), err
}

func GetArtistFromID(ID string) *Artist {
	var ar Artist
	config.DB.Where("artist_id = ?", ID).FirstOrCreate(&ar, Artist{
		ArtistID: ID,
	})
	return &ar
}

func (a *Artist) Update(cl spotify.Client) {
	var artists []*Artist
	artists = append(artists, a)
	BatchUpdateArtists(artists, cl)
}

func BatchUpdateArtists(artists []*Artist, cl spotify.Client) {
	newArtists := []*Artist{}
	for _, s := range artists {
		if s.Name == "" {
			newArtists = append(newArtists, s)
		}
	}
	ids := []spotify.ID{}
	limit := 50
	for _, s := range newArtists {
		ids = append(ids, spotify.ID(s.ArtistID))
	}
	for i := 0; i < len(ids); i += limit {
		size := len(ids)
		if size > i+limit {
			size = i + limit
		}
		batch := ids[i:size]
		info, err := cl.GetArtists(batch...)
		if err != nil {
			log.Error(err)
			return
		}

		for ind, s := range info {
			newArtists[ind+i].Name = s.Name
			if len(s.Images) > 0 {
				newArtists[ind+i].Image = s.Images[0].URL
			}
			newArtists[ind+i].Popularity = int16(s.Popularity)
			newArtists[ind+i].Genres = s.Genres
			newArtists[ind+i].Save()
		}
	}
}

func (a *Artist) Save() error {
	if !enableSaving {
		return nil
	}
	inDB := GetArtistFromID(a.ArtistID)
	if inDB.ID != a.ID {
		msg := fmt.Sprintf("Duplicate entry detected: %d and %d", inDB.ID, a.ID)
		log.Error(msg)
		return errors.New(msg)
	}
	if a.ArtistID == "" {
		msg := fmt.Sprintf("Tried to save empty track_id, ID = %d", a.ID)
		log.Error(msg)
		return errors.New(msg)
	}
	config.DB.Save(a)
	return nil
}
