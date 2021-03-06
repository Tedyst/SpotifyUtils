package userutils

import (
	"strings"

	"github.com/google/uuid"
	log "github.com/sirupsen/logrus"
	"github.com/tedyst/spotifyutils/config"
)

type CompareStruct struct {
	Artists []TopArtist
	Tracks  []TopTrack
	Genres  []string
	Score   float32
}

// Compares two users and returns the result
func (u *User) Compare(target *User) CompareStruct {
	u.RefreshTop()
	target.RefreshTop()
	c1 := compare(u, target)
	c2 := compare(target, u)
	if c1.Score > c2.Score {
		return c1
	}
	return c2
}

func compare(u1 *User, u2 *User) CompareStruct {
	t1 := u1.Top
	t2 := u2.Top
	result := CompareStruct{
		Artists: []TopArtist{},
		Tracks:  []TopTrack{},
		Genres:  []string{},
		Score:   0,
	}

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
				result.Artists = append(result.Artists, s1)
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
				result.Tracks = append(result.Tracks, s1)
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
				result.Genres = append(result.Genres, s1)
			}
		}
	}

	if tracksTotal != 0 {
		result.Score += float32(150 * tracksScore / tracksTotal)
	}
	if artistTotal != 0 {
		result.Score += float32(100 * artistScore / artistTotal)
	}
	if genresTotal != 0 {
		result.Score += float32(80 * genresScore / genresTotal)
	}
	if result.Score > 100 {
		result.Score = 100
	}

	log.WithFields(log.Fields{
		"type":   "compare",
		"user":   u1,
		"target": u2,
		"result": result.Score,
	}).Debugf("Compare")

	return result
}

func (u *User) verifyifCompareCodeExists() {
	if u.CompareCode != "" {
		return
	}
	u.CompareCode = generateNewCompareCode()
	log.WithFields(log.Fields{
		"type": "compare",
		"user": u,
		"code": u.CompareCode,
	}).Debugf("Generated new compare code")
	u.Save()
}

func generateNewCompareCode() string {
	for length := 6; length <= 12; length++ {
		for i := 1; i <= 10; i++ {
			newUUID := uuid.New().String()
			newUUID = newUUID[len(newUUID)-length:]
			var count int64
			config.DB.Model(&User{}).Where("compare_code = ?", newUUID).Count(&count)
			if count == 0 {
				return strings.ToUpper(newUUID)
			}
		}
	}
	// If this ever happens...
	return ""
}

// GetFriends returns a user's friends
func (u *User) GetFriends() []*User {
	var result []*User
	for _, s := range u.Friends {
		result = append(result, GetUser(s))
	}
	return result
}

// AddFriend appends a friend to a user's friend list and otherwise
func (u *User) AddFriend(target *User) {
	if target.ID == u.ID {
		u.addFriend(target)
		return
	}
	u.addFriend(target)
	target.addFriend(u)
}

func (u *User) addFriend(target *User) {
	for _, s := range u.Friends {
		if s == target.UserID {
			return
		}
	}
	u.Friends = append(u.Friends, target.UserID)
	u.Save()
	log.WithFields(log.Fields{
		"type":   "friends",
		"user":   u,
		"target": target,
	}).Debugf("Added friend")
}

// RemoveFriend removes a friend from a user's friend list and back
func (u *User) RemoveFriend(target *User) {
	if target.ID == u.ID {
		u.removeFriend(target)
		return
	}
	u.removeFriend(target)
	target.removeFriend(u)
}

func (u *User) removeFriend(target *User) {
	for i, s := range u.Friends {
		if s == target.UserID {
			u.Friends = append(u.Friends[:i], u.Friends[i+1:]...)
			u.Save()
			log.WithFields(log.Fields{
				"type":   "friends",
				"user":   u,
				"target": target,
			}).Debugf("Removed friend")
			return
		}
	}
}
