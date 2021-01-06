package tracks

import (
	"errors"
	"fmt"
	"time"

	log "github.com/sirupsen/logrus"
	"github.com/tedyst/spotifyutils/config"
	"github.com/zmb3/spotify"
	"gorm.io/gorm"
)

type Track struct {
	gorm.Model
	TrackID string `gorm:"type:VARCHAR(30) NOT NULL UNIQUE"`

	Lyrics          string
	SearchingLyrics bool `json:"-"`

	LastUpdated time.Time
	Artist      string
	Name        string
	Information SpotifyInformation `gorm:"embedded;embeddedPrefix:information_"`
}

func GetTrackFromID(ID string) *Track {
	var tr Track
	config.DB.Where("track_id = ?", ID).FirstOrCreate(&tr, Track{
		TrackID: ID,
	})
	return &tr
}

func BatchUpdate(tracks []*Track, cl spotify.Client) {
	newTracks := []*Track{}
	for _, s := range tracks {
		if s.Name == "" || s.Information.Updated == false {
			newTracks = append(newTracks, s)
		}
	}
	ids := []spotify.ID{}
	limit := 50
	for _, s := range newTracks {
		ids = append(ids, spotify.ID(s.TrackID))
	}
	for i := 0; i < len(ids); i += limit {
		size := len(ids)
		if size > i+limit {
			size = i + limit
		}
		batch := ids[i:size]
		info, err := cl.GetTracks(batch...)
		if err != nil {
			log.Error(err)
			return
		}
		features, err := cl.GetAudioFeatures(batch...)
		if err != nil {
			log.Error(err)
			return
		}

		for ind, s := range info {
			newTracks[ind+i].Artist = s.Artists[0].Name
			newTracks[ind+i].Name = s.Name
			newTracks[ind+i].Information.TrackInformation.Explicit = s.Explicit
			newTracks[ind+i].TrackID = s.ID.String()

			if len(s.Album.Images) > 0 {
				newTracks[ind+i].Information.TrackInformation.Image = s.Album.Images[0].URL
			}

			newTracks[ind+i].Information.TrackInformation.Length = s.Duration
			newTracks[ind+i].Information.TrackInformation.Markets = len(s.AvailableMarkets)
			newTracks[ind+i].Information.TrackInformation.Popularity = s.Popularity
			newTracks[ind+i].Information.TrackInformation.Explicit = s.Explicit

			newTracks[ind+i].Information.AlbumInformation.ID = s.Album.ID.String()

			// Sometimes it is possible for the features to be nil, for Monstercat Instinct Songs for example
			if len(features) > 0 && features[ind] != nil {
				newTracks[ind+i].Information.TrackFeatures.Acousticness = features[ind].Acousticness
				newTracks[ind+i].Information.TrackFeatures.Energy = features[ind].Energy
				newTracks[ind+i].Information.TrackFeatures.Instrumentalness = features[ind].Instrumentalness
				newTracks[ind+i].Information.TrackFeatures.Liveness = features[ind].Liveness
				newTracks[ind+i].Information.TrackFeatures.Loudness = features[ind].Loudness
				newTracks[ind+i].Information.TrackFeatures.Speechiness = features[ind].Speechiness
			}

			newTracks[ind+i].Save()
			go newTracks[ind+i].updateLyrics()
		}

		go func(client *spotify.Client, tr []*Track) {
			for _, s := range tr {
				s.Update(cl)
				time.Sleep(1 * time.Second)
			}
		}(&cl, newTracks)
	}
}

func (t *Track) Save() error {
	if !enableSaving {
		return nil
	}
	inDB := GetTrackFromID(t.TrackID)
	if inDB.ID != t.ID {
		msg := fmt.Sprintf("Duplicate entry detected: %s and %s", inDB.ID, t.ID)
		log.Error(msg)
		return errors.New(msg)
	}
	if t.TrackID == "" {
		msg := fmt.Sprintf("Tried to save empty track_id, ID = %s", t.ID)
		log.Error(msg)
		return errors.New(msg)
	}
	config.DB.Save(t)
	return nil
}

func (t *Track) Update(cl spotify.Client) error {
	var err1 error
	var err2 error
	if t.Information.Updated == false {
		err1 = t.updateInformation(cl)
		err := t.Save()
		if err != nil {
			return err
		}
	}
	if time.Since(t.LastUpdated) >= 24*time.Hour {
		err2 = t.updateLyrics()
		t.LastUpdated = time.Now()
		err := t.Save()
		if err != nil {
			return err
		}
	}
	t.LastUpdated = time.Now()

	if err1 != nil {
		return err1
	}
	if err2 != nil {
		return err2
	}
	return nil
}
