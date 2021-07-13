package tracks

import (
	"sync"
	"time"

	log "github.com/sirupsen/logrus"
	"github.com/tedyst/spotifyutils/config"
	"github.com/tedyst/spotifyutils/metrics"
	"github.com/zmb3/spotify"
	"gorm.io/gorm"
)

var trackMutex = make(map[string]*sync.Mutex)

type Track struct {
	ID        uint           `gorm:"primarykey" json:"-"`
	CreatedAt time.Time      `json:"-"`
	UpdatedAt time.Time      `json:"-"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
	TrackID   string         `gorm:"type:VARCHAR(30) NOT NULL UNIQUE"`

	Lyrics string

	LastUpdated time.Time `json:"-"`
	Artists     []Artist  `gorm:"many2many:track_artists;"`
	Name        string
	Information SpotifyInformation `gorm:"embedded;embeddedPrefix:information_"`

	Mutex *sync.Mutex `gorm:"-"`
}

// GetTrackFromID returns a track from database and sets its mutex
func GetTrackFromID(ID string) *Track {
	var tr Track
	config.DB.Where("track_id = ?", ID).Preload("Artists").FirstOrCreate(&tr, Track{
		TrackID: ID,
	})
	tr.Mutex = getTrackMutex(ID)
	return &tr
}

func getTrackMutex(ID string) *sync.Mutex {
	val, ok := trackMutex[ID]
	if ok {
		return val
	}
	val = &sync.Mutex{}
	trackMutex[ID] = val
	return val
}

// TrackExists returns true if the tracks exists or false otherwise
func TrackExists(ID string) bool {
	var count int64
	config.DB.Model(&Track{}).Where("track_id = ?", ID).Count(&count)
	return count != 0
}

// BatchUpdate updates the information of a list of tracks using the most efficient method
func BatchUpdate(tracks []*Track, cl spotify.Client) {
	if *config.MockExternalCalls {
		return
	}
	newTracks := []*Track{}
	for _, s := range tracks {
		if s.Name == "" || !s.Information.Updated {
			newTracks = append(newTracks, s)
		}
	}
	ids := []spotify.ID{}
	limit := 50
	for _, s := range newTracks {
		ids = append(ids, spotify.ID(s.TrackID))
	}

	var artistUpdate []*Artist
	for i := 0; i < len(ids); i += limit {
		size := len(ids)
		if size > i+limit {
			size = i + limit
		}
		batch := ids[i:size]
		metrics.SpotifyRequests.Add(1)
		info, err := cl.GetTracks(batch...)
		if err != nil {
			log.Error(err)
			return
		}
		metrics.SpotifyRequests.Add(1)
		features, err := cl.GetAudioFeatures(batch...)
		if err != nil {
			log.Error(err)
			return
		}

		for ind, s := range info {
			var artists []Artist
			for _, s := range s.Artists {
				a := GetArtistFromID(s.ID.String())
				a.Name = s.Name
				artists = append(artists, *a)
				artistUpdate = append(artistUpdate, a)
			}
			newTracks[ind+i].Artists = artists
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
		}

	}
	go func(client *spotify.Client, tr []*Track, artists []*Artist) {
		BatchUpdateArtists(artists, cl)
		for _, s := range tr {
			s.Update(cl, true)
			time.Sleep(5 * time.Second)
		}
	}(&cl, newTracks, artistUpdate)
}

// Save a track to the database
func (t *Track) Save() error {
	if !enableSaving {
		return nil
	}
	if err := config.DB.Save(t).Error; err != nil {
		log.WithFields(log.Fields{
			"type":  "tracks",
			"track": t,
		}).Error(err)
		return err
	}
	return nil
}

// Update a track's information
func (t *Track) Update(cl spotify.Client, syncUpdateLyrics bool) error {
	t.Mutex.Lock()
	defer t.Mutex.Unlock()
	var err1 error
	var err2 error
	if !t.Information.Updated {
		err1 = t.updateInformation(cl)
		err := t.Save()
		if err != nil {
			log.WithFields(log.Fields{
				"type":  "tracks",
				"track": t,
			}).Error(err)
			return err
		}
	}
	if time.Since(t.LastUpdated) >= searchTimeout {
		if syncUpdateLyrics {
			err2 = t.updateLyrics()
			t.LastUpdated = time.Now()
			err := t.Save()
			if err != nil {
				log.WithFields(log.Fields{
					"type":  "tracks",
					"track": t,
				}).Error(err)
				return err
			}
		} else {
			go func() {
				t.updateLyrics()
				t.LastUpdated = time.Now()
				err := t.Save()
				if err != nil {
					log.WithFields(log.Fields{
						"type":  "tracks",
						"track": t,
					}).Error(err)
				}
			}()
		}
	}
	t.LastUpdated = time.Now()

	if err1 != nil {
		log.WithFields(log.Fields{
			"type":  "tracks",
			"track": t,
		}).Error(err1)
		return err1
	}
	if err2 != nil {
		log.WithFields(log.Fields{
			"type":  "tracks",
			"track": t,
		}).Error(err2)
		return err2
	}
	return nil
}

// ArtistString returns the artist name as a string
func (t *Track) ArtistString() string {
	if len(t.Artists) == 0 {
		log.WithFields(log.Fields{
			"type":  "tracks",
			"track": t,
		}).Error("No Artists")
		return ""
	}
	var str string
	for _, s := range t.Artists {
		str += s.Name + ", "
	}
	if str == "" {
		log.WithFields(log.Fields{
			"type":  "tracks",
			"track": t,
		}).Error("Artists is set but string is nil")
	}
	return str[:len(str)-2]
}

// String returns the track id as a string
func (t Track) String() string {
	return t.TrackID
}
