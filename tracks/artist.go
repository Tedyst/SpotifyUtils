package tracks

import (
	"database/sql/driver"
	"encoding/json"
	"time"

	log "github.com/sirupsen/logrus"
	"github.com/tedyst/spotifyutils/config"
	"github.com/tedyst/spotifyutils/mapofmutex"
	"github.com/tedyst/spotifyutils/metrics"
	"github.com/zmb3/spotify"
)

var artistMutex = mapofmutex.New()

type Artist struct {
	ID         uint      `gorm:"primarykey" json:"-"`
	CreatedAt  time.Time `json:"-"`
	DeletedAt  time.Time `gorm:"index" json:"-"`
	ArtistID   string    `gorm:"type:VARCHAR(30) NOT NULL UNIQUE"`
	Name       string
	Genres     GenresStruct
	Popularity int16
	Image      string
	Updated    bool
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

// GetArtistFromID
func GetArtistFromID(ID string) *Artist {
	a, ok := config.ArtistCache.Get(ID)
	if ok {
		ar := a.(Artist)
		return &ar
	}
	var ar Artist
	config.DB.Where("artist_id = ?", ID).FirstOrCreate(&ar, Artist{
		ArtistID: ID,
	})
	config.ArtistCache.Set(ID, ar, 1)
	return &ar
}

func (a *Artist) Update(cl spotify.Client) {
	if a.Updated {
		return
	}
	artists := []*Artist{a}
	BatchUpdateArtists(artists, cl)
}

func BatchUpdateArtists(artists []*Artist, cl spotify.Client) {
	if *config.MockExternalCalls {
		return
	}
	newArtists := []*Artist{}
	for _, s := range artists {
		ok := true
		for _, a := range newArtists {
			if a.ArtistID == s.ArtistID {
				ok = false
			}
		}
		if !s.Updated && ok {
			unlocker := artistMutex.Lock(s.ArtistID)
			defer unlocker.Unlock()
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
		metrics.SpotifyRequests.Add(1)
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
			newArtists[ind+i].Updated = true
			newArtists[ind+i].Save()
		}
	}
}

// Save saves the artist to DB
func (a *Artist) Save() error {
	if !enableSaving {
		return nil
	}
	config.TrackCache.Set(a.ArtistID, *a, 1)
	if err := config.DB.Save(a).Error; err != nil {
		log.WithFields(log.Fields{
			"type":   "artist",
			"artist": a,
		}).Error(err)
		return err
	}
	return nil
}

// String returns the artist ID
func (a Artist) String() string {
	return a.ArtistID
}
