package tracks

import "time"

var enableSaving = true
var enableLyricsGetter = true

const retryTimeout = 10 * time.Second

var blacklistedSentences = []string{
	"Spotify-new-music",
}
