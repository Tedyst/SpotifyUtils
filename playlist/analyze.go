package playlist

import "github.com/tedyst/spotifyutils/tracks"

type medianStruct struct {
	Least  *tracks.Track
	Most   *tracks.Track
	Median int32
}

type AnalyzeStruct struct {
	Artists map[string]int32

	Danceability     medianStruct
	Energy           medianStruct
	Acousticness     medianStruct
	Instrumentalness medianStruct

	Genres     []string
	Popularity medianStruct
	BPM        medianStruct
	Explicit   int32
}

func Analyze(tracks []*tracks.Track) AnalyzeStruct {
	response := AnalyzeStruct{}
	for _, s := range tracks {
		response.Artists[s.Artists[0].Name]++
	}
	return response
}
