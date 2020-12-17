package tracks

import (
	"time"

	log "github.com/sirupsen/logrus"
	"github.com/tedyst/spotifyutils/config"
	"github.com/zmb3/spotify"
	"gorm.io/gorm"
)

type Track struct {
	gorm.Model
	TrackID string

	Lyrics          string
	SearchingLyrics bool `json:"-"`

	LastUpdated time.Time
	Artist      string
	Name        string
	Information SpotifyInformation `gorm:"embedded;embeddedPrefix:information_"`
}

func RecentlyPlayedItemToTrack(s spotify.SimpleTrack) *Track {
	track := getTrackFromDB(string(s.ID))
	track.Artist = s.Artists[0].Name
	track.Name = s.Name
	return track
}

func GetTrackFromID(ID string) *Track {
	var track Track
	track.TrackID = ID
	config.DB.Where("track_id = ?", ID).FirstOrCreate(&track)
	return &track
}

func BatchUpdate(tracks []*Track, cl spotify.Client) {
	newTracks := []*Track{}
	for _, s := range tracks {
		if s.Name == "" {
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
		for ind, s := range info {
			newTracks[ind+i].Artist = s.Artists[0].Name
			newTracks[ind+i].Name = s.Name
			newTracks[ind+i].Information.TrackInformation.Explicit = s.Explicit
			newTracks[ind+i].Information.TrackInformation.Image = s.Album.Images[0].URL
			newTracks[ind+i].Save()
		}
	}

}

func getTrackFromDB(ID string) *Track {
	if !enableSaving {
		return &Track{
			TrackID:     ID,
			LastUpdated: time.Unix(0, 0),
		}
	}
	var track Track
	track.TrackID = ID
	config.DB.Where("track_id = ?", ID).FirstOrCreate(&track)
	return &track
}

func (t *Track) Save() error {
	if !enableSaving {
		return nil
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
