package tracks

import (
	"fmt"
	"time"

	"github.com/gabyshev/genius-api/genius"

	"github.com/tedyst/spotifyutils/api/config"
)

func (t *Track) UpdateLyrics() error {
	if time.Since(t.LastUpdated) < time.Hour {
		return nil
	}
	if t.Lyrics != "" {
		return nil
	}
	name := fmt.Sprintf("%s %s", t.Artist, t.Name)
	res, err := config.GeniusClient.Search(name)
	if err != nil {
		return err
	}
	for _, s := range res.Response.Hits {
		if validResponse(t, s.Result) {
			fmt.Println(s.Result.URL)
			break
		}
	}

	return nil
}

func validResponse(t *Track, song *genius.Song) bool {
	return true
}

func getLyricsFromURL(url string) string {
	return ""
}
