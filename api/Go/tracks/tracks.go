package tracks

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	"github.com/prometheus/client_golang/prometheus"
	"github.com/tedyst/spotifyutils/api/config"
	"github.com/tedyst/spotifyutils/api/metrics"
	"github.com/zmb3/spotify"
)

type Track struct {
	ID string

	Lyrics          string
	SearchingLyrics bool `json:"-"`

	LastUpdated time.Time
	Artist      string
	Name        string
	Information SpotifyInformation
}

var tracksCache []*Track

func SimpleConvertToTrack(s spotify.SimpleTrack) *Track {
	track := getTrackFromDB(string(s.ID))
	track.Artist = s.Artists[0].Name
	track.Name = s.Name
	return track
}

func GetTrackFromID(cl spotify.Client, ID string) *Track {
	for _, s := range tracksCache {
		if s.ID == ID {
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
			ID:          ID,
			LastUpdated: time.Unix(0, 0),
		}
	}
	rows := config.DB.QueryRow("SELECT Lyrics FROM trackLyrics WHERE ID = ?", ID)
	var lyrics string
	err := rows.Scan(&lyrics)
	if err == sql.ErrNoRows {
		_, err := config.DB.Exec("INSERT INTO trackLyrics (ID, Lyrics) VALUES (?,?)", ID, "")
		if err != nil {
			metrics.ErrorCount.With(prometheus.Labels{"error": fmt.Sprint(err), "source": "tracks.GetTrack()"}).Inc()
			log.Print(err)
		}
		lyrics = ""
	}

	rows = config.DB.QueryRow("SELECT LastUpdated FROM trackFeatures WHERE ID = ?", ID)
	var lastUpdated time.Time
	var temp int64
	err = rows.Scan(&temp)
	if err == sql.ErrNoRows {
		lastUpdated = time.Unix(0, 0)
		_, err = config.DB.Exec("INSERT INTO trackFeatures (ID, LastUpdated) VALUES (?,?)", ID, lastUpdated.Unix())
		if err != nil {
			metrics.ErrorCount.With(prometheus.Labels{"error": fmt.Sprint(err), "source": "tracks.GetTrack()"}).Inc()
			log.Print(err)
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

func (t *Track) Save() error {
	if !enableSaving {
		return nil
	}
	_, err := config.DB.Exec(`UPDATE trackLyrics SET Lyrics = ? WHERE ID = ?`,
		t.Lyrics, t.ID)
	if err != nil {
		metrics.ErrorCount.With(prometheus.Labels{"error": fmt.Sprint(err), "source": "tracks.Save()"}).Inc()
		log.Print(err)
		return err
	}
	_, err = config.DB.Exec(`UPDATE trackFeatures SET LastUpdated = ? WHERE ID = ?`,
		t.LastUpdated.Unix(), t.ID)
	if err != nil {
		metrics.ErrorCount.With(prometheus.Labels{"error": fmt.Sprint(err), "source": "tracks.Save()"}).Inc()
		log.Print(err)
		return err
	}
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
