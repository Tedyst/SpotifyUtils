package tracks

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/prometheus/client_golang/prometheus"
	"github.com/tedyst/spotifyutils/api/config"
	"github.com/tedyst/spotifyutils/api/metrics"
	"github.com/zmb3/spotify"
)

type Track struct {
	ID          string
	Lyrics      string
	LastUpdated time.Time
	Artist      string
	Name        string
}

func SimpleConvertToTrack(s spotify.SimpleTrack) *Track {
	track := getTrackFromDB(string(s.ID))
	track.Artist = s.Artists[0].Name
	track.Name = s.Name
	return track
}

func getTrackFromDB(ID string) *Track {
	rows := config.DB.QueryRow("SELECT Lyrics FROM trackLyrics WHERE ID = ?", ID)
	var lyrics string
	err := rows.Scan(&lyrics)
	if err == sql.ErrNoRows {
		_, err := config.DB.Exec("INSERT INTO trackLyrics (ID, Lyrics) VALUES (?,?)", ID, "")
		if err != nil {
			metrics.ErrorCount.With(prometheus.Labels{"error": fmt.Sprint(err), "source": "tracks.GetTrack()"}).Inc()
		}
		lyrics = ""
	}

	rows = config.DB.QueryRow("SELECT LastUpdated FROM trackFeatures WHERE ID = ?", ID)
	var lastUpdated time.Time
	var temp int64
	err = rows.Scan(&temp)
	if err == sql.ErrNoRows {
		lastUpdated = time.Now()
		_, err = config.DB.Exec("INSERT INTO trackFeatures (ID, LastUpdated) VALUES (?,?)", ID, lastUpdated.Unix())
		if err != nil {
			metrics.ErrorCount.With(prometheus.Labels{"error": fmt.Sprint(err), "source": "tracks.GetTrack()"}).Inc()
		}
	} else {
		lastUpdated = time.Unix(temp, 0)
	}
	return &Track{
		ID:          ID,
		Lyrics:      lyrics,
		LastUpdated: lastUpdated,
	}
}
