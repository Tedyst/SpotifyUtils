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
	if t.Name == "" || len(t.Artists) == 0 || t.ArtistString() == "" {
		log.WithFields(log.Fields{
			"type":  "lyrics",
			"track": t.TrackID,
		}).Debugf("Name or Artist field not set")
		return nil
	}
	t.Save()
	metrics.TrackLyricsSearched.Add(1)
	geni, err := genius.Lyrics(t.Name, t.ArtistString())
	if err == nil {
		log.Debugf("Got lyrics for %s-%s using Genius", t.ArtistString(), t.Name)
		t.Lyrics = geni
		t.Save()
		return nil
	}
	t.Save()
	return nil
}
