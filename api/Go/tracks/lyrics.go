package tracks

import (
	"bytes"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/PuerkitoBio/goquery"
	"github.com/gabyshev/genius-api/genius"
	"golang.org/x/net/html"

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
	url = "https://genius.com/Ariana-grande-santa-tell-me-lyrics"
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

	if err != nil {
		log.Print(err)
		return "", err
	}

	lyrics := ""
	selection := doc.Find("div.lyrics")
	selection.Children().Each(func(_ int, s *goquery.Selection) {
		text := nodeText(s)
		if text != "\n" && text != "" {
			lyrics += text + "\n"
		}
	})
	strings.ReplaceAll(lyrics, "\n\n", "\n")
	lyrics = stripText(lyrics)
	log.Print(lyrics)
	return lyrics, nil
}

func stripText(s string) string {
	return strings.Trim(s, " \n")
}

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
