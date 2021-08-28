package playlist

import (
	"github.com/tedyst/spotifyutils/tracks"
)

type responseSong struct {
	Name   string
	Artist string
	URI    string
	Image  string
}

type medianStruct struct {
	Highest struct {
		Track responseSong
		Value float32
	}
	Lowest struct {
		Track responseSong
		Value float32
	}
	Median float32
}

type AnalyzeStruct struct {
	Artists map[string]int32

	Energy           medianStruct
	Acousticness     medianStruct
	Instrumentalness medianStruct
	Popularity       medianStruct
	Tempo            medianStruct

	Genres   map[string]int32
	Explicit int32
}

func Analyze(tracks []*tracks.Track) AnalyzeStruct {
	response := AnalyzeStruct{}
	response.Artists = make(map[string]int32)
	response.Genres = make(map[string]int32)
	tempoCount := 0
	popularityCount := 0
	energyCount := 0
	acousticnessCount := 0
	instrumentalnessCount := 0
	for _, s := range tracks {
		for _, artist := range s.Artists {
			response.Artists[artist.Name] += 1
			for _, genre := range artist.Genres {
				response.Genres[genre] += 1
			}
		}
		if s.Information.TrackFeatures.Energy > 0.1 {
			energyCount++
			if response.Energy.Highest.Value < s.Information.TrackFeatures.Energy {
				response.Energy.Highest.Value = s.Information.TrackFeatures.Energy
				response.Energy.Highest.Track = responseSong{
					Name:   s.Name,
					Artist: s.ArtistString(),
					URI:    s.TrackID,
					Image:  s.Information.TrackInformation.Image,
				}
			}
			if response.Energy.Lowest.Value > s.Information.TrackFeatures.Energy || response.Energy.Lowest.Value == 0 {
				response.Energy.Lowest.Value = s.Information.TrackFeatures.Energy
				response.Energy.Lowest.Track = responseSong{
					Name:   s.Name,
					Artist: s.ArtistString(),
					URI:    s.TrackID,
					Image:  s.Information.TrackInformation.Image,
				}
			}
			response.Energy.Median += s.Information.TrackFeatures.Energy
		}
		if s.Information.TrackFeatures.Acousticness > 0.1 {
			acousticnessCount++
			if response.Acousticness.Highest.Value < s.Information.TrackFeatures.Acousticness {
				response.Acousticness.Highest.Value = s.Information.TrackFeatures.Acousticness
				response.Acousticness.Highest.Track = responseSong{
					Name:   s.Name,
					Artist: s.ArtistString(),
					URI:    s.TrackID,
					Image:  s.Information.TrackInformation.Image,
				}
			}
			if response.Acousticness.Lowest.Value > s.Information.TrackFeatures.Acousticness || response.Acousticness.Lowest.Value == 0 {
				response.Acousticness.Lowest.Value = s.Information.TrackFeatures.Acousticness
				response.Acousticness.Lowest.Track = responseSong{
					Name:   s.Name,
					Artist: s.ArtistString(),
					URI:    s.TrackID,
					Image:  s.Information.TrackInformation.Image,
				}
			}
			response.Acousticness.Median += s.Information.TrackFeatures.Acousticness
		}
		if s.Information.TrackFeatures.Instrumentalness > 0.1 {
			instrumentalnessCount++
			if response.Instrumentalness.Highest.Value < s.Information.TrackFeatures.Instrumentalness {
				response.Instrumentalness.Highest.Value = s.Information.TrackFeatures.Instrumentalness
				response.Instrumentalness.Highest.Track = responseSong{
					Name:   s.Name,
					Artist: s.ArtistString(),
					URI:    s.TrackID,
					Image:  s.Information.TrackInformation.Image,
				}
			}
			if response.Instrumentalness.Lowest.Value > s.Information.TrackFeatures.Instrumentalness || response.Instrumentalness.Lowest.Value == 0 {
				response.Instrumentalness.Lowest.Value = s.Information.TrackFeatures.Instrumentalness
				response.Instrumentalness.Lowest.Track = responseSong{
					Name:   s.Name,
					Artist: s.ArtistString(),
					URI:    s.TrackID,
					Image:  s.Information.TrackInformation.Image,
				}
			}
			response.Instrumentalness.Median += s.Information.TrackFeatures.Instrumentalness
		}
		if s.Information.TrackInformation.Popularity > 0 {
			popularityCount++
			if response.Popularity.Highest.Value < float32(s.Information.TrackInformation.Popularity) {
				response.Popularity.Highest.Value = float32(s.Information.TrackInformation.Popularity)
				response.Popularity.Highest.Track = responseSong{
					Name:   s.Name,
					Artist: s.ArtistString(),
					URI:    s.TrackID,
					Image:  s.Information.TrackInformation.Image,
				}
			}
			if response.Popularity.Lowest.Value > float32(s.Information.TrackInformation.Popularity) || response.Popularity.Lowest.Value == 0 {
				response.Popularity.Lowest.Value = float32(s.Information.TrackInformation.Popularity)
				response.Popularity.Lowest.Track = responseSong{
					Name:   s.Name,
					Artist: s.ArtistString(),
					URI:    s.TrackID,
					Image:  s.Information.TrackInformation.Image,
				}
			}
			response.Popularity.Median += float32(s.Information.TrackInformation.Popularity)
		}
		if s.Information.TrackInformation.Tempo > 0 {
			tempoCount++
			if response.Tempo.Highest.Value < float32(s.Information.TrackInformation.Tempo) {
				response.Tempo.Highest.Value = float32(s.Information.TrackInformation.Tempo)
				response.Tempo.Highest.Track = responseSong{
					Name:   s.Name,
					Artist: s.ArtistString(),
					URI:    s.TrackID,
					Image:  s.Information.TrackInformation.Image,
				}
			}
			if response.Tempo.Lowest.Value > float32(s.Information.TrackInformation.Tempo) || response.Tempo.Lowest.Value == 0 {
				response.Tempo.Lowest.Value = float32(s.Information.TrackInformation.Tempo)
				response.Tempo.Lowest.Track = responseSong{
					Name:   s.Name,
					Artist: s.ArtistString(),
					URI:    s.TrackID,
					Image:  s.Information.TrackInformation.Image,
				}
			}
			response.Tempo.Median += float32(s.Information.TrackInformation.Tempo)
		}
		if s.Information.TrackInformation.Explicit {
			response.Explicit += 1
		}
	}
	response.Energy.Median /= float32(energyCount)
	response.Acousticness.Median /= float32(acousticnessCount)
	response.Instrumentalness.Median /= float32(instrumentalnessCount)
	response.Popularity.Median /= float32(popularityCount)
	response.Tempo.Median /= float32(tempoCount)
	return response
}
