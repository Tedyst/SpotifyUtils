package tracks

import (
	log "github.com/sirupsen/logrus"

	"github.com/tedyst/spotifyutils/metrics"
	"github.com/tedyst/spotifyutils/tracks/lyrics/genius"
)

func (t *Track) updateLyrics() error {
	if !enableLyricsGetter {
		return nil
	}
	if t.Lyrics != "" {
		return nil
	}
	if t.Name == "" || len(t.Artists) == 0 {
		log.WithFields(log.Fields{
			"type": "genius",
		}).Errorf("Name or Artist field not set for %s", t.TrackID)
		return nil
	}
	t.Save()
	metrics.TrackLyricsSearched.Add(1)
	log.Debugf("Starting Update Lyrics for %s-%s", t.ArtistString(), t.Name)
	genius, err := genius.Lyrics(t.Name, t.ArtistString())
	if err == nil {
		t.Lyrics = genius
		t.Save()
		return nil
	}
	t.Save()
	return nil
}
