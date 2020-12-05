package tracks

import (
	"fmt"
	"log"
	"net/http"
	"regexp"
	"time"

	"github.com/PuerkitoBio/goquery"
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
			lyrics, err := getLyricsFromURL(s.Result.URL)
			if err != nil {
				log.Print(err)
				break
			}
			t.Lyrics = lyrics
			t.LastUpdated = time.Now()
			err = t.Save()
			if err != nil {
				log.Print(err)
			}
			break
		}
	}

	return nil
}

func validResponse(t *Track, song *genius.Song) bool {
	return true
}

func getLyricsFromURL(url string) (string, error) {
	res, err := http.Get(url)
	if err != nil {
		log.Fatal(err)
		return "", err
	}
	defer res.Body.Close()
	if res.StatusCode != 200 {
		log.Printf("status code error: %d %s", res.StatusCode, res.Status)
		return "", fmt.Errorf("status code error: %d %s", res.StatusCode, res.Status)
	}

	// Load the HTML document
	doc, err := goquery.NewDocumentFromReader(res.Body)

	bodyBytes, err := doc.Html()
	if err != nil {
		log.Fatal(err)
	}
	regex, err := regexp.Compile("Lyrics__Container([^\" ]*)")
	if err != nil {
		return "", err
	}
	regexResult := regex.Find([]byte(bodyBytes))
	searching := ".lyrics"
	if regexResult != nil {
		searching = fmt.Sprintf(".%s", string(regexResult))
	}

	if err != nil {
		log.Print(err)
		return "", err
	}

	lyrics := ""
	selection := doc.Find(searching)
	selection.Children().Each(func(_ int, s *goquery.Selection) {
		text := s.Text()
		lyrics += text
	})
	return lyrics, nil
}
