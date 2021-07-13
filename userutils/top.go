package userutils

import (
	"sort"
	"time"

	log "github.com/sirupsen/logrus"
	"github.com/tedyst/spotifyutils/config"
	"github.com/tedyst/spotifyutils/metrics"
	"github.com/zmb3/spotify"
)

type TopArtist struct {
	Name  string
	Image string
	ID    string
}

type TopTrack struct {
	Artist     string
	Name       string
	Image      string
	ID         string
	Duration   int
	PreviewURL string
}

type TopStruct struct {
	Genres  GenresStruct
	Updated int64
	Artists ArtistsStruct
	Tracks  TracksStruct
}

// RefreshTop updates the user's top
func (u *User) RefreshTop() error {
	u.mutex.RefreshTop.Lock()
	defer u.mutex.RefreshTop.Unlock()
	if *config.MockExternalCalls {
		return nil
	}
	err := u.RefreshToken()
	if err != nil {
		return err
	}
	t := time.Since(time.Unix(u.Top.Updated, 0))
	if t < 10*time.Minute {
		return nil
	}
	result := &TopStruct{}
	longString := string("long")
	longOptions := &spotify.Options{
		Timerange: &longString,
	}
	shortString := string("short")
	shortOptions := &spotify.Options{
		Timerange: &shortString,
	}
	metrics.SpotifyRequests.Add(1)
	longTopArtists, err := u.Client().CurrentUsersTopArtistsOpt(longOptions)
	if err != nil {
		log.WithFields(log.Fields{
			"type":        "top",
			"user":        u,
			"tokenExpiry": u.Token.Expiry.Unix(),
		}).Error(err)
		return err
	}
	metrics.SpotifyRequests.Add(1)
	shortTopArtists, err := u.Client().CurrentUsersTopArtistsOpt(shortOptions)
	if err != nil {
		log.WithFields(log.Fields{
			"type":        "top",
			"user":        u,
			"tokenExpiry": u.Token.Expiry.Unix(),
		}).Error(err)
		return err
	}
	metrics.SpotifyRequests.Add(1)
	shortTopTracks, err := u.Client().CurrentUsersTopTracksOpt(shortOptions)
	if err != nil {
		log.WithFields(log.Fields{
			"type":        "top",
			"user":        u,
			"tokenExpiry": u.Token.Expiry.Unix(),
		}).Error(err)
		return err
	}

	result.Genres = sortGenres(longTopArtists)

	for _, s := range shortTopArtists.Artists {
		track := TopArtist{
			ID:   string(s.ID),
			Name: s.Name,
		}
		if len(s.Images) > 0 {
			track.Image = s.Images[0].URL
		}
		result.Artists = append(result.Artists, track)
	}
	for _, s := range shortTopTracks.Tracks {
		toptrack := TopTrack{
			Duration:   s.Duration,
			ID:         string(s.ID),
			Name:       s.Name,
			PreviewURL: s.PreviewURL,
		}

		toptrack.Artist = artistString(&s)
		if len(s.Album.Images) > 0 {
			toptrack.Image = s.Album.Images[0].URL
		}
		result.Tracks = append(result.Tracks, toptrack)
	}
	result.Updated = time.Now().Unix()

	u.Top.Artists = result.Artists
	u.Top.Genres = result.Genres
	u.Top.Tracks = result.Tracks
	u.Top.Updated = result.Updated
	u.Save()
	return nil
}

func artistString(t *spotify.FullTrack) string {
	if len(t.Artists) == 0 {
		log.WithFields(log.Fields{
			"type":  "top",
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
			"type":  "top",
			"track": t,
		}).Error("Artists is set but string is nil")
	}
	return str[:len(str)-2]
}

func sortGenres(TopArtists *spotify.FullArtistPage) []string {
	m := make(map[string]int)
	for _, s := range TopArtists.Artists {
		for _, genre := range s.Genres {
			m[genre]++
		}
	}

	type needed struct {
		name  string
		count int
	}
	sorting := []needed{}
	for i, s := range m {
		sorting = append(sorting, needed{
			name:  i,
			count: s,
		})
	}
	sort.Slice(sorting, func(i, j int) bool {
		return sorting[i].count > sorting[j].count
	})

	result := []string{}
	for _, s := range sorting {
		result = append(result, s.name)
	}
	return result
}
