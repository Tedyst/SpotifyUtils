package userutils

import (
	"fmt"
	"sort"

	"github.com/prometheus/client_golang/prometheus"
	"github.com/tedyst/spotifyutils/api/metrics"
	"github.com/zmb3/spotify"
)

// Top returns the top from user's preferences
func (u *User) Top() {
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
		return
	}
	shortTopTracks, err := u.Client.CurrentUsersTopTracksOpt(shortOptions)
	if err != nil {
		metrics.ErrorCount.With(prometheus.Labels{"error": fmt.Sprint(err), "source": "userutils.Top()"}).Inc()
		return
	}
	fmt.Println(shortTopTracks)
	fmt.Println(longTopArtists)

	genres := sortGenres(longTopArtists)
	fmt.Println(genres)
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
