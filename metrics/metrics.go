package metrics

import (
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
)

var (
	TrackInformationSearched = promauto.NewCounter(prometheus.CounterOpts{
		Namespace: "spotifyutils",
		Name:      "track_information_searched",
		Help:      "The total number of tracks searched against the sptify api",
	})
	TrackLyricsSearched = promauto.NewCounter(prometheus.CounterOpts{
		Namespace: "spotifyutils",
		Name:      "track_lyrics_searched",
		Help:      "The total number of tracks searched against Genius",
	})
	UserCount = promauto.NewGauge(prometheus.GaugeOpts{
		Namespace: "spotifyutils",
		Name:      "users",
		Help:      "The total number of users",
	})
	TrackingUserCount = promauto.NewGauge(prometheus.GaugeOpts{
		Namespace: "spotifyutils",
		Name:      "users_tracking",
		Help:      "The total number of users that are tracked",
	})
	RecentTracksAdded = promauto.NewGauge(prometheus.GaugeOpts{
		Namespace: "spotifyutils",
		Name:      "recent_tracks_added",
		Help:      "The total number of recent tracks that are added across all users",
	})
)
