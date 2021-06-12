package genius

import (
	"bytes"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/PuerkitoBio/goquery"
	"github.com/gabyshev/genius-api/genius"
	log "github.com/sirupsen/logrus"
	"github.com/tedyst/spotifyutils/config"
	"golang.org/x/net/html"
)

const retryTimeout = 10 * time.Second
const retryCount = 5

var blacklistedSentences = []string{
	"Spotify-new-music",
}

func Lyrics(trackName string, trackArtist string) (string, error) {
	if *config.MockExternalCalls {
		return "", errors.New("getting song info from Genius is disabled")
	}
	name := fmt.Sprintf("%s %s", trackArtist, trackName)
	res, err := config.GeniusClient.Search(name)
	if err != nil {
		log.WithFields(log.Fields{
			"type":   "genius",
			"name":   trackName,
			"artist": trackArtist,
		}).Error(err)
		return "", err
	}
	if len(res.Response.Hits) == 0 {
		log.WithFields(log.Fields{
			"type":   "genius",
			"name":   trackName,
			"artist": trackArtist,
		}).Debug("Could not find song on Genius")
		return "", errors.New("could not find song on Genius")
	}
	for _, s := range res.Response.Hits {
		if validResponse(trackName, trackArtist, s) {
			var lyrics string
			for i := 1; i <= retryCount; i++ {
				lyrics, err = getLyricsFromURL(s.Result.URL)
				if err != nil {
					log.WithFields(log.Fields{
						"type":   "genius",
						"url":    s.Result.URL,
						"name":   trackName,
						"artist": trackArtist,
					}).Error(err)
					break
				}
				if lyrics != "" {
					return lyrics, nil
				} else {
					log.WithFields(log.Fields{
						"type":   "genius",
						"url":    s.Result.URL,
						"name":   trackName,
						"artist": trackArtist,
					}).Debug("Trying again")
					time.Sleep(retryTimeout)
				}
			}
			if lyrics == "" {
				log.WithFields(log.Fields{
					"type":   "genius",
					"url":    s.Result.URL,
					"name":   trackName,
					"artist": trackArtist,
				}).Debug("Could not extract lyrics")
			}
			break
		}
	}
	log.WithFields(log.Fields{
		"type":   "genius",
		"name":   trackName,
		"artist": trackArtist,
	}).Debug("Could not find Lyrics")
	return "", errors.New("could not find Genius Lyrics")
}

func validResponse(name string, artist string, song *genius.Hit) bool {
	for _, s := range blacklistedSentences {
		if strings.Contains(song.Result.FullTitle, s) {
			return false
		}
	}
	if strings.Contains(song.Result.FullTitle, name) || strings.Contains(song.Result.FullTitle, artist) {
		return song.Type == "song"
	}
	return false
}

func getLyricsFromURL(url string) (string, error) {
	res, err := http.Get(url)
	if err != nil {
		log.Error(err)
		return "", err
	}
	defer res.Body.Close()
	if res.StatusCode != 200 {
		log.Errorf("status code error: %d %s", res.StatusCode, res.Status)
		return "", fmt.Errorf("status code error: %d %s", res.StatusCode, res.Status)
	}

	// Load the HTML document
	doc, err := goquery.NewDocumentFromReader(res.Body)

	if err != nil {
		log.Error(err)
		return "", err
	}

	lyrics := ""
	selection := doc.Find(".lyrics")

	selection.Children().Each(func(_ int, s *goquery.Selection) {
		text := nodeText(s)
		if text != "\n" && text != "" {
			lyrics += text + "\n"
		}
	})
	strings.ReplaceAll(lyrics, "\n\n", "\n")
	lyrics = stripText(lyrics)
	return lyrics, nil
}

func stripText(s string) string {
	return strings.Trim(s, " \n")
}

// Copied straight from library implementation
func nodeText(s *goquery.Selection) string {
	var buf bytes.Buffer

	// Slightly optimized vs calling Each: no single selection object created
	var f func(*html.Node)
	f = func(n *html.Node) {
		if n.Type == html.TextNode {
			// Keep newlines and spaces, like jQuery
			buf.WriteString(n.Data)
		}
		if n.FirstChild != nil {
			for c := n.FirstChild; c != nil; c = c.NextSibling {
				f(c)
			}
		}
	}
	for _, n := range s.Nodes {
		f(n)
	}

	return buf.String()
}
