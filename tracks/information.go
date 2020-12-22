package tracks

import (
	"database/sql/driver"
	"encoding/json"

	"github.com/sirupsen/logrus"
	log "github.com/sirupsen/logrus"
	"github.com/zmb3/spotify"
)

type TrackFeaturesStruct struct {
	Acousticness     float32
	Energy           float32
	Instrumentalness float32
	Liveness         float32
	Loudness         float32
	Speechiness      float32
	LoudnessGraph    LoudnessGraphStruct
}

type LoudnessGraphStruct []int

func (sla *LoudnessGraphStruct) Scan(value interface{}) error {
	switch v := value.(type) {
	case []byte:
		logrus.Tracef("Using []byte as type, value %v", v)
		return json.Unmarshal(value.([]byte), &sla)
	case string:
		logrus.Tracef("Using string as type, value %v", v)
		return json.Unmarshal([]byte(value.(string)), &sla)
	default:
		log.Panic("Not found interface type")
	}
	return nil
}

func (sla LoudnessGraphStruct) Value() (driver.Value, error) {
	val, err := json.Marshal(sla)
	return string(val), err
}

type TrackInformationStruct struct {
	Image         string
	Popularity    int
	Length        int
	Markets       int
	Explicit      bool
	Key           int
	Mode          int
	Tempo         float64
	TimeSignature int
}

type AlbumInformationStruct struct {
	Popularity   int
	ReleaseDate  string
	TracksAmount int
	Markets      int
}

type SpotifyInformation struct {
	TrackInformation TrackInformationStruct `gorm:"embedded;embeddedPrefix:track_"`
	AlbumInformation AlbumInformationStruct `gorm:"embedded;embeddedPrefix:album_"`
	TrackFeatures    TrackFeaturesStruct    `gorm:"embedded;embeddedPrefix:features_"`
	Updated          bool                   `json:"-"`
}

func (t *Track) updateInformation(cl spotify.Client) error {
	if t.Information.Updated == true {
		return nil
	}
	log.Debugf("Getting spotify information for track %s", t.TrackID)
	track, err := cl.GetTrack(spotify.ID(t.TrackID))
	if err != nil {
		log.WithFields(log.Fields{
			"type": "spotify-api",
		}).Error(err)
		return err
	}
	t.Name = track.Name
	t.Artist = track.Artists[0].Name

	if t.Information.TrackFeatures.Energy == 0 {
		features, err := cl.GetAudioFeatures(spotify.ID(t.TrackID))
		if err != nil {
			log.WithFields(log.Fields{
				"type": "spotify-api",
			}).Error(err)
			// time.Sleep(retryTimeout)
			// return err
		}
		if len(features) != 0 {
			t.Information.TrackFeatures.Acousticness = features[0].Acousticness
			t.Information.TrackFeatures.Energy = features[0].Energy
			t.Information.TrackFeatures.Instrumentalness = features[0].Instrumentalness
			t.Information.TrackFeatures.Liveness = features[0].Liveness
			t.Information.TrackFeatures.Loudness = features[0].Loudness
			t.Information.TrackFeatures.Speechiness = features[0].Speechiness
		}
	}
	analysis, err := cl.GetAudioAnalysis(spotify.ID(t.TrackID))
	if err != nil {
		log.WithFields(log.Fields{
			"type": "spotify-api",
		}).Error(err)
		return err
	}
	album, err := cl.GetAlbum(spotify.ID(track.Album.ID))
	if err != nil {
		log.WithFields(log.Fields{
			"type": "spotify-api",
		}).Error(err)
		return err
	}
	t.Information.Updated = true

	t.Information.TrackInformation.Explicit = track.Explicit
	t.Information.TrackInformation.Key = int(analysis.Track.Key)
	t.Information.TrackInformation.Length = track.Duration
	t.Information.TrackInformation.Markets = len(track.AvailableMarkets)
	t.Information.TrackInformation.Mode = int(analysis.Track.Mode)
	t.Information.TrackInformation.Popularity = track.Popularity
	t.Information.TrackInformation.Tempo = analysis.Track.Tempo
	t.Information.TrackInformation.TimeSignature = analysis.Track.TimeSignature

	if len(album.Images) > 0 {
		t.Information.TrackInformation.Image = album.Images[0].URL
	}

	t.Information.AlbumInformation.Markets = len(album.AvailableMarkets)
	t.Information.AlbumInformation.ReleaseDate = album.ReleaseDate
	t.Information.AlbumInformation.TracksAmount = album.Tracks.Total
	t.Information.AlbumInformation.Popularity = album.Popularity

	return nil
}
