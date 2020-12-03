package userutils

import (
	"strings"

	"github.com/google/uuid"
	"github.com/tedyst/spotifyutils/api/config"
)

type CompareStruct struct {
	CommonArtists []TopArtist `json:"artists"`
	CommonTracks  []TopTrack  `json:"tracks"`
	CommonGenres  []string    `json:"genres"`
	Score         float32     `json:"percent"`
}

func (u1 *User) Compare(u2 *User) CompareStruct {
	u1.RefreshTop()
	u2.RefreshTop()
	c1 := u1.compare(u2)
	c2 := u2.compare(u1)
	if c1.Score > c2.Score {
		return c1
	}
	return c2
}

func (u1 *User) compare(u2 *User) CompareStruct {
	t1 := u1.Top
	t2 := u2.Top
	result := CompareStruct{}

	artistTotal := 1
	artistScore := 0
	artistMax := len(t1.Artists)
	if len(t1.Artists) < len(t2.Artists) {
		artistMax = len(t2.Artists)
	}
	for i1, s1 := range t1.Artists {
		artistTotal += artistMax - i1
		for i2, s2 := range t2.Artists {
			if s1.ID == s2.ID {
				artistScore += artistMax - i2
				result.CommonArtists = append(result.CommonArtists, s1)
			}
		}
	}

	tracksTotal := 1
	tracksScore := 0
	tracksMax := len(t1.Tracks)
	for i1, s1 := range t1.Tracks {
		tracksTotal += tracksMax - i1
		for i2, s2 := range t2.Tracks {
			if s1.ID == s2.ID {
				tracksScore += tracksMax - i2
				result.CommonTracks = append(result.CommonTracks, s1)
			}
		}
	}

	genresTotal := 1
	genresScore := 0
	genresMax := len(t1.Genres)
	for i1, s1 := range t1.Genres {
		genresTotal += genresMax - i1
		for i2, s2 := range t2.Genres {
			if s1 == s2 {
				genresScore += genresMax - i2
				result.CommonGenres = append(result.CommonGenres, s1)
			}
		}
	}

	result.Score += float32(150 * tracksScore / tracksTotal)
	result.Score += float32(100 * artistScore / artistTotal)
	result.Score += float32(80 * genresScore / genresTotal)
	return result
}

func generateNewCompareCode() string {
	var count int
	for length := 6; length <= 12; length++ {
		for i := 1; i <= 10; i++ {
			newUUID := uuid.New().String()[:length]
			res := config.DB.QueryRow("SELECT COUNT(*) FROM users WHERE CompareCode = ?", newUUID)
			res.Scan(&count)
			if count == 0 {
				return strings.ToUpper(newUUID)
			}
		}
	}
	// If this ever happens...
	return ""
}
