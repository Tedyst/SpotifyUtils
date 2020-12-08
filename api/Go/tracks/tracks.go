package tracks

import (
	"time"

	"github.com/tedyst/spotifyutils/api/config"
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

var tracksCache []*Track

func RecentlyPlayedItemToTrack(s spotify.SimpleTrack) *Track {
	track := getTrackFromDB(string(s.ID))
	track.Artist = s.Artists[0].Name
	track.Name = s.Name
	return track
}

func GetTrackFromID(cl spotify.Client, ID string) *Track {
	for _, s := range tracksCache {
		if s.TrackID == ID {
			return s
		}
	}
	spotifyTrack, err := cl.GetTrack(spotify.ID(ID))
	if err != nil {
		return getTrackFromDB(ID)
	}
	track := getTrackFromDB(ID)
	track.Artist = spotifyTrack.Artists[0].Name
	track.Name = spotifyTrack.Name
	tracksCache = append(tracksCache, track)
	return track
}

func getTrackFromDB(ID string) *Track {
	if !enableSaving {
		return &Track{
			TrackID:     ID,
			LastUpdated: time.Unix(0, 0),
		}
	}
	var track Track
	config.DB.Where("track_id = ?", ID).Find(&track)
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
	}
	if time.Since(t.LastUpdated) >= time.Hour {
		err2 = t.updateLyrics()
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
