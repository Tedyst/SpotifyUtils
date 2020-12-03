package userutils

import (
	"fmt"
	"sort"
	"time"

	"github.com/prometheus/client_golang/prometheus"
	"github.com/tedyst/spotifyutils/api/metrics"
	"github.com/zmb3/spotify"
)

type TopArtist struct {
	Name  string `json:"name"`
	Image string `json:"image"`
	ID    string `json:"id"`
}

type TopTrack struct {
	Artist     string `json:"artist"`
	Name       string `json:"name"`
	Image      string `json:"image"`
	ID         string `json:"id"`
	Duration   int    `json:"duration"`
	PreviewURL string `json:"preview_url"`
}

type TopResult struct {
	Genres  []string    `json:"genres"`
	Updated int64       `json:"updated"`
	Artists []TopArtist `json:"artists"`
	Tracks  []TopTrack  `json:"tracks"`
}

// RefreshTop updated the user's top
func (u *User) RefreshTop() error {
	if time.Since(time.Unix(u.Top.Updated, 0)) < 10*time.Minute {
		return nil
	}
	result := &TopResult{}
	longString := string("long")
	longOptions := &spotify.Options{
		Timerange: &longString,
	}
	shortString := string("long")
	shortOptions := &spotify.Options{
		Timerange: &shortString,
	}
	longTopArtists, err := u.Client.CurrentUsersTopArtistsOpt(longOptions)
	if err != nil {
		metrics.ErrorCount.With(prometheus.Labels{"error": fmt.Sprint(err), "source": "userutils.Top()"}).Inc()
		return err
	}
	shortTopArtists, err := u.Client.CurrentUsersTopArtistsOpt(shortOptions)
	if err != nil {
		metrics.ErrorCount.With(prometheus.Labels{"error": fmt.Sprint(err), "source": "userutils.Top()"}).Inc()
		return err
	}
	shortTopTracks, err := u.Client.CurrentUsersTopTracksOpt(shortOptions)
	if err != nil {
		metrics.ErrorCount.With(prometheus.Labels{"error": fmt.Sprint(err), "source": "userutils.Top()"}).Inc()
		return err
	}

	result.Genres = sortGenres(longTopArtists)

	for _, s := range shortTopArtists.Artists {
		result.Artists = append(result.Artists, TopArtist{
			ID:    string(s.ID),
			Name:  s.Name,
			Image: s.Images[0].URL,
		})
	}
	for _, s := range shortTopTracks.Tracks {
		result.Tracks = append(result.Tracks, TopTrack{
			Artist:     string(s.Artists[0].Name),
			Duration:   s.Duration,
			ID:         string(s.ID),
			Image:      s.Album.Images[0].URL,
			Name:       s.Name,
			PreviewURL: s.PreviewURL,
		})
	}
	result.Updated = time.Now().Unix()

	u.Top = *result
	return nil
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
	sort.Slice(sorting[:], func(i, j int) bool {
		return sorting[i].count > sorting[j].count
	})

	result := []string{}
	for _, s := range sorting {
		result = append(result, s.name)
	}
	return result
}
