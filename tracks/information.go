package tracks

import (
	log "github.com/sirupsen/logrus"
	"github.com/tedyst/spotifyutils/config"
	"github.com/tedyst/spotifyutils/metrics"
	"github.com/zmb3/spotify"
)

type TrackFeaturesStruct struct {
	Acousticness     float32
	Energy           float32
	Instrumentalness float32
	Liveness         float32
	Loudness         float32
	Speechiness      float32
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
	ID           string
}

type SpotifyInformation struct {
	TrackInformation TrackInformationStruct `gorm:"embedded;embeddedPrefix:track_"`
	AlbumInformation AlbumInformationStruct `gorm:"embedded;embeddedPrefix:album_"`
	TrackFeatures    TrackFeaturesStruct    `gorm:"embedded;embeddedPrefix:features_"`
	Updated          bool                   `json:"-"`
}

func (t *Track) NeedUpdate() bool {
	if t.Information.Updated {
		return false
	}
	if t.Information.AlbumInformation.ID == "" {
		return true
	}
	if t.Information.TrackInformation.Length == 0 {
		return true
	}
	if t.Information.TrackFeatures.Energy == 0 {
		return true
	}
	if t.Information.TrackInformation.Tempo == 0 {
		return true
	}
	if t.Information.AlbumInformation.Markets == 0 {
		return true
	}
	return false
}

func (t *Track) updateInformation(cl spotify.Client) error {
	if *config.MockExternalCalls {
		return nil
	}
	if !t.NeedUpdate() {
		return nil
	}
	metrics.TrackInformationSearched.Add(1)
	log.WithFields(log.Fields{
		"type":  "information",
		"track": t,
	}).Debugf("Getting spotify information")

	if t.Information.AlbumInformation.ID == "" || len(t.Artists) == 0 {
		metrics.SpotifyRequests.Add(1)
		track, err := cl.GetTrack(spotify.ID(t.TrackID))
		if err != nil {
			log.WithFields(log.Fields{
				"type":  "information",
				"api":   "track",
				"track": t,
			}).Error(err)
			return err
		}
		t.Name = track.Name

		var artistsBatch []*Artist
		for _, s := range track.Artists {
			a := GetArtistFromID(s.ID.String())
			a.Name = s.Name
			artistsBatch = append(artistsBatch, a)
		}
		BatchUpdateArtists(artistsBatch, cl)
		var artists []Artist
		for _, s := range artistsBatch {
			artists = append(artists, *s)
		}
		t.Artists = artists

		t.Information.TrackInformation.Explicit = track.Explicit
		t.Information.TrackInformation.Length = track.Duration
		t.Information.TrackInformation.Markets = len(track.AvailableMarkets)
		t.Information.TrackInformation.Popularity = track.Popularity
		t.Information.AlbumInformation.ID = string(track.Album.ID)
	}

	if t.Information.TrackFeatures.Energy == 0 {
		metrics.SpotifyRequests.Add(1)
		features, err := cl.GetAudioFeatures(spotify.ID(t.TrackID))
		if err != nil {
			log.WithFields(log.Fields{
				"type":  "information",
				"api":   "features",
				"track": t,
			}).Error(err)
			return err
		}
		if len(features) != 0 && features[0] != nil {
			t.Information.TrackFeatures.Acousticness = features[0].Acousticness
			t.Information.TrackFeatures.Energy = features[0].Energy
			t.Information.TrackFeatures.Instrumentalness = features[0].Instrumentalness
			t.Information.TrackFeatures.Liveness = features[0].Liveness
			t.Information.TrackFeatures.Loudness = features[0].Loudness
			t.Information.TrackFeatures.Speechiness = features[0].Speechiness
		}
	}

	if t.Information.TrackInformation.Tempo == 0 {
		metrics.SpotifyRequests.Add(1)
		analysis, err := cl.GetAudioAnalysis(spotify.ID(t.TrackID))
		if err != nil {
			// Sometimes spotify likes to return `{"error": {"status": 502,"message": "Request was not transferred"}}`
			// This does not return because if this happens, the track cannot be viewed
			log.WithFields(log.Fields{
				"type":  "information",
				"api":   "analysis",
				"track": t,
			}).Error(err)
		} else {
			t.Information.TrackInformation.Mode = int(analysis.Track.Mode)
			t.Information.TrackInformation.Tempo = analysis.Track.Tempo
			t.Information.TrackInformation.Key = int(analysis.Track.Key)
			t.Information.TrackInformation.TimeSignature = analysis.Track.TimeSignature
		}
	}

	if t.Information.AlbumInformation.Markets == 0 && t.Information.AlbumInformation.ID != "" {
		metrics.SpotifyRequests.Add(1)
		album, err := cl.GetAlbum(spotify.ID(t.Information.AlbumInformation.ID))
		if err != nil {
			log.WithFields(log.Fields{
				"type":  "information",
				"api":   "album",
				"track": t,
			}).Error(err)
			return err
		}

		if len(album.Images) > 0 {
			t.Information.TrackInformation.Image = album.Images[0].URL
		}

		t.Information.AlbumInformation.Markets = len(album.AvailableMarkets)
		t.Information.AlbumInformation.ReleaseDate = album.ReleaseDate
		t.Information.AlbumInformation.TracksAmount = album.Tracks.Total
		t.Information.AlbumInformation.Popularity = album.Popularity
	}

	t.Information.Updated = true

	return nil
}
