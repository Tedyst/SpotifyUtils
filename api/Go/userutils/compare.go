package userutils

import (
	"fmt"
	"strings"

	"github.com/google/uuid"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/tedyst/spotifyutils/api/config"
	"github.com/tedyst/spotifyutils/api/metrics"
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
	result := CompareStruct{
		CommonArtists: []TopArtist{},
		CommonTracks:  []TopTrack{},
		CommonGenres:  []string{},
		Score:         0,
	}

	artistCount := 0
	artistMax := len(t1.Artists)
	if len(t1.Artists) < len(t2.Artists) {
		artistMax = len(t2.Artists)
	}
	for _, s1 := range t1.Artists {
		for _, s2 := range t2.Artists {
			if s1.ID == s2.ID {
				artistCount++
				result.CommonArtists = append(result.CommonArtists, s1)
			}
		}
	}

	tracksTotal := len(t1.Tracks)
	tracksScore := 0
	for _, s1 := range t1.Tracks {
		for _, s2 := range t2.Tracks {
			if s1.ID == s2.ID {
				tracksScore++
				result.CommonTracks = append(result.CommonTracks, s1)
			}
		}
	}

	genresTotal := len(t1.Genres)
	genresScore := 0
	for _, s1 := range t1.Genres {
		for _, s2 := range t2.Genres {
			if s1 == s2 {
				genresScore++
				result.CommonGenres = append(result.CommonGenres, s1)
			}
		}
	}

	result.Score += float32(100 * tracksScore / tracksTotal)
	result.Score += float32(100 * artistCount / artistMax)
	result.Score += float32(100 * genresScore / genresTotal)
	result.Score = float32(result.Score / 3)

	return result
}

func generateNewCompareCode() string {
	var count int
	for length := 6; length <= 12; length++ {
		for i := 1; i <= 10; i++ {
			newUUID := uuid.New().String()
			newUUID = newUUID[len(newUUID)-length:]
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

func (u *User) GetFriends() []*User {
	rows, err := config.DB.Query("SELECT FriendID FROM friends WHERE ID = ?", u.ID)
	defer rows.Close()
	if err != nil {
		metrics.ErrorCount.With(prometheus.Labels{"error": fmt.Sprint(err), "source": "userutils.GetFriends()"}).Inc()
		return []*User{}
	}
	var result []*User
	for rows.Next() {
		var temp string
		rows.Scan(&temp)
		result = append(result, GetUser(temp))
	}
	return result
}

func (u *User) AddFriend(target *User) {
	u.addFriend(target)
	target.addFriend(u)
}

func (u *User) addFriend(target *User) {
	rows := config.DB.QueryRow("SELECT COUNT(*) FROM friends WHERE ID = ? AND FriendID = ?", u.ID, target.ID)
	var count int
	err := rows.Scan(&count)
	if err != nil {
		metrics.ErrorCount.With(prometheus.Labels{"error": fmt.Sprint(err), "source": "userutils.addFriend()"}).Inc()
		return
	}
	if count == 1 {
		return
	}
	_, err = config.DB.Exec("INSERT INTO friends (ID, FriendID) VALUES (?,?)", u.ID, target.ID)
	if err != nil {
		metrics.ErrorCount.With(prometheus.Labels{"error": fmt.Sprint(err), "source": "userutils.addFriend()"}).Inc()
		return
	}
}
