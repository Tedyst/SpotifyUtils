package azlyrics

import (
	"fmt"
	"net/http"
	"net/url"
	"strings"

	"github.com/PuerkitoBio/goquery"
	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
)

const azLyricsURL = "https://azlyrics.com"
const azLyricsSearchURL = "https://search.azlyrics.com/search.php"

func searchSong(artist, name string) (string, error) {
	u, _ := url.Parse(azLyricsSearchURL)
	q := u.Query()
	q.Set("q", artist+" - "+name)
	u.RawQuery = q.Encode()
	res, err := http.Get(u.String())
	if err != nil {
		logrus.Error(err)
		return "", err
	}
	defer res.Body.Close()
	if res.StatusCode != 200 {
		logrus.Errorf("status code error: %d %s", res.StatusCode, res.Status)
		return "", fmt.Errorf("status code error: %d %s", res.StatusCode, res.Status)
	}

	doc, err := goquery.NewDocumentFromReader(res.Body)

	if err != nil {
		logrus.Error(err)
		return "", err
	}

	selection := doc.Find(".table")

	selection = selection.Find("a")

	var newURL string
	selection.Each(func(_ int, s *goquery.Selection) {
		link, ok := s.Attr("href")
		if ok {
			if newURL == "" {
				newURL = link
			}
		}
	})
	if newURL == "" {
		return "", errors.Errorf("Could not find lyrics for %s - %s", artist, name)
	}
	return newURL, nil
}

func extractLyrics(u string) (string, error) {
	res, err := http.Get(u)
	if err != nil {
		logrus.Error(err)
		return "", err
	}
	defer res.Body.Close()
	if res.StatusCode != 200 {
		logrus.Errorf("status code error: %d %s", res.StatusCode, res.Status)
		return "", fmt.Errorf("status code error: %d %s", res.StatusCode, res.Status)
	}

	doc, err := goquery.NewDocumentFromReader(res.Body)

	if err != nil {
		logrus.Error(err)
		return "", err
	}

	selection := doc.Find(".col-lg-8")
	selection = selection.Find("div").Next().Next().Next().Next().Next().Next().Next()
	lyrics := selection.First().Text()

	if lyrics == "" {
		return "", errors.Errorf("Could not extract lyrics for %s", u)
	}
	return stripText(lyrics), nil
}

func stripText(s string) string {
	return strings.Trim(s, " \n")
}

func Lyrics(trackName string, trackArtist string) (string, error) {
	u, err := searchSong(trackArtist, trackName)
	if err != nil {
		return "", err
	}
	lyrics, err := extractLyrics(u)
	if err != nil {
		return "", err
	}
	return lyrics, nil
}
