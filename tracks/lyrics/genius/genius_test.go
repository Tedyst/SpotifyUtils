package genius

import (
	"flag"
	"fmt"
	"os"
	"strings"
	"testing"

	"github.com/gabyshev/genius-api/genius"
	"github.com/joho/godotenv"
	"github.com/sirupsen/logrus"
	"github.com/tedyst/spotifyutils/config"
)

func TestMain(m *testing.M) {
	setupTests()
	code := m.Run()
	os.Exit(code)
}

func lookupEnvOrString(key string, defaultVal string) string {
	if val, ok := os.LookupEnv(key); ok {
		return val
	}
	return defaultVal
}

func setupTests() {
	err := godotenv.Load("../../../.env")
	if err != nil {
		logrus.Info("Could not load .env file")
	}
	flag.Parse()
	if *config.GeniusToken == "" {
		token := lookupEnvOrString("GENIUS_TOKEN", "")
		config.GeniusToken = &token
		config.GeniusClient = genius.NewClient(nil, *config.GeniusToken)
	}
	if *config.GeniusToken == "" {
		logrus.Fatal("Could not load Genius Token")
	}
}

var lyricstests = []struct {
	artist   string
	name     string
	contains string
}{
	{"Halsey", "Clementine", "asdsadassadas"},
	{"Skott", "Talk About Me", "new"},
	{"Halsey", "Haunting", "me"},
}

func TestLyrics(t *testing.T) {
	t.Parallel()
	for _, tt := range lyricstests {
		tt := tt
		name := fmt.Sprintf("%s-%s", tt.name, tt.artist)
		t.Run(name, func(t *testing.T) {
			t.Parallel()
			ly, err := Lyrics(tt.name, tt.artist)
			if err != nil {
				t.Skipf("Did not find lyrics for %s", name)
			}
			if !strings.Contains(ly, tt.contains) {
				t.Skipf("Lyrics for %s did not contain %s", name, tt.contains)
			}
		})
	}
}

var nolyricstests = []struct {
	name   string
	artist string
}{
	{"Tedy", "Stoica"},
}

func TestNoLyrics(t *testing.T) {
	for _, tt := range nolyricstests {
		name := fmt.Sprintf("%s-%s", tt.name, tt.artist)
		t.Run(name, func(t *testing.T) {
			ly, err := Lyrics(tt.name, tt.artist)
			if err == nil {
				t.Skipf("Found lyrics for %s when we shouldn't", name)
				t.Log(ly)
			}
		})
	}
}
