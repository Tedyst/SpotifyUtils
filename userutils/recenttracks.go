package userutils

import (
	"fmt"
	"time"

	log "github.com/sirupsen/logrus"

	"github.com/tedyst/spotifyutils/config"
	"github.com/tedyst/spotifyutils/metrics"
	"github.com/tedyst/spotifyutils/tracks"
	"github.com/zmb3/spotify"
)

const updateTimer = 2 * time.Hour

type RecentTracks struct {
	ID         uint `gorm:"primarykey"`
	User       uint
	Track      string
	ListenedAt int64 `gorm:"autoCreateTime"`
}

// UpdateRecentTracks updates the recent tracks
func (u *User) UpdateRecentTracks() {
	if *config.MockExternalCalls {
		return
	}
	if !u.Settings.RecentTracks {
		return
	}
	err := u.RefreshToken()
	if err != nil {
		return
	}
	log.WithFields(log.Fields{
		"type":        "recenttracks",
		"user":        u,
		"tokenExpiry": u.Token.Expiry.Unix(),
	}).Debugf("Updating recent tracks")
	options := &spotify.RecentlyPlayedOptions{Limit: 50}
	items, err := u.Client().PlayerRecentlyPlayedOpt(options)
	if err != nil {
		log.WithFields(log.Fields{
			"type":        "recenttracks",
			"user":        u,
			"tokenExpiry": u.Token.Expiry.Unix(),
		}).Error(err)
		return
	}
	list := []*tracks.Track{}
	for _, s := range items {
		t := tracks.GetTrackFromID(string(s.Track.ID))
		list = append(list, t)
	}
	tracks.BatchUpdate(list, *u.Client())

	u.insertRecentTracks(items)
}

func (u *User) insertRecentTracks(items []spotify.RecentlyPlayedItem) {
	var recent []RecentTracks
	var present []RecentTracks
	var first time.Time
	var last time.Time
	if len(items) == 0 {
		return
	} else if len(items) == 1 {
		first = items[0].PlayedAt
		last = items[0].PlayedAt
	} else {
		first = items[0].PlayedAt
		last = items[len(items)-1].PlayedAt
	}
	config.DB.Where("listened_at <= ?", first.Unix()).Where("listened_at >= ?", last.Unix()).Where("user = ?", fmt.Sprint(u.ID)).Find(&present)
	for _, s := range items {
		ok := true
		for _, s2 := range present {
			if s2.ListenedAt == s.PlayedAt.Unix() {
				ok = false
				break
			}
		}
		if ok {
			recent = append(recent, RecentTracks{
				User:       u.ID,
				Track:      string(s.Track.ID),
				ListenedAt: s.PlayedAt.Unix(),
			})
		}
	}
	if len(recent) != 0 {
		metrics.RecentTracksAdded.Add(float64(len(recent)))
		config.DB.Create(&recent)
	}
}

func (u User) StartRecentTracksUpdater() {
	_, timer := searchTimers(u.UserID)
	if timer.Lock != nil {
		if !u.Settings.RecentTracks {
			u.StopRecentTracksUpdater()
		}
		return
	}
	log.WithFields(log.Fields{
		"type": "recenttracks",
		"user": u,
	}).Debugf("Started recent tracks timer")
	// Update once
	go u.UpdateRecentTracks()

	ticker := time.NewTicker(updateTimer)
	quit := make(chan struct{})
	timer.Lock = &quit
	go func(u User) {
		for {
			select {
			case <-ticker.C:
				u.UpdateRecentTracks()
			case <-quit:
				log.WithFields(log.Fields{
					"type": "recenttracks",
					"user": u,
				}).Debugf("Stopped recent tracks timer")
				ticker.Stop()
				return
			}
		}
	}(u)
}

type RecentTracksTimerStruct struct {
	UserID string
	Lock   *chan struct{}
}

var recentTrackTimerCache []*RecentTracksTimerStruct

func searchTimers(UserID string) (int, *RecentTracksTimerStruct) {
	for i, s := range recentTrackTimerCache {
		if s.UserID == UserID {
			return i, s
		}
	}
	result := &RecentTracksTimerStruct{
		UserID: UserID,
	}
	recentTrackTimerCache = append(recentTrackTimerCache, result)
	return len(recentTrackTimerCache) - 1, result
}

func (u *User) StopRecentTracksUpdater() {
	index, timer := searchTimers(u.UserID)
	if timer.Lock == nil {
		return
	}
	close(*timer.Lock)
	recentTrackTimerCache[index] = recentTrackTimerCache[len(recentTrackTimerCache)-1]
	recentTrackTimerCache[len(recentTrackTimerCache)-1] = nil
	recentTrackTimerCache = recentTrackTimerCache[:len(recentTrackTimerCache)-1]
}

func (u *User) GetRecentTracks() ([]*tracks.Track, error) {
	if *config.MockExternalCalls {
		return []*tracks.Track{}, nil
	}
	err := u.RefreshToken()
	if err != nil {
		return nil, err
	}
	options := &spotify.RecentlyPlayedOptions{Limit: 50}
	items, err := u.Client().PlayerRecentlyPlayedOpt(options)
	if err != nil {
		log.WithFields(log.Fields{
			"type":        "recenttracks",
			"user":        u.UserID,
			"tokenExpiry": u.Token.Expiry.Unix(),
		}).Error(err)
		return nil, err
	}
	if u.Settings.RecentTracks {
		u.insertRecentTracks(items)
	}

	list := []*tracks.Track{}
	for _, s := range items {
		t := tracks.GetTrackFromID(string(s.Track.ID))
		list = append(list, t)
	}
	tracks.BatchUpdate(list, *u.Client())

	return list, nil
}

func (u *User) GetRecentTrackSince(t time.Time) []RecentTracks {
	var result []RecentTracks
	config.DB.Where("listened_at >= ?", t.Unix()).Where("user = ?", fmt.Sprint(u.ID)).Find(&result)
	return result
}

type getTopRecentTrackSinceResult struct {
	Count int
	Track string
}

func (u *User) getTopRecentTrackSince(t time.Time) []getTopRecentTrackSinceResult {
	var result []getTopRecentTrackSinceResult
	config.DB.Raw(`SELECT COUNT(id) AS count, track
		FROM recent_tracks
		WHERE listened_at >= ? AND user = ? 
		GROUP BY track
		ORDER BY COUNT(id) DESC
		LIMIT 96`,
		t.Unix(), u.ID).Scan(&result)
	return result
}

type getListenedHoursRecentTrackSinceResult struct {
	Count int
	Time  int
}

func (u *User) getListenedHoursRecentTrackSince(t time.Time) []getListenedHoursRecentTrackSinceResult {
	var result []getListenedHoursRecentTrackSinceResult
	config.DB.Raw(`SELECT COUNT(id) AS count,
		(listened_at % 86400)/3600 AS time
		FROM recent_tracks
		WHERE listened_at >= ? AND user = ?
		GROUP BY (listened_at % 86400)/3600
		ORDER BY (listened_at % 86400)/3600`,
		t.Unix(), u.ID).Scan(&result)
	return result
}

type getListenedDaysRecentTrackSinceResult struct {
	Count int
	Time  int
}

func (u *User) getListenedDaysRecentTrackSince(t time.Time) []getListenedDaysRecentTrackSinceResult {
	var result []getListenedDaysRecentTrackSinceResult
	config.DB.Raw(`SELECT COUNT(*) AS count,
		(listened_at / 86400)*86400 AS time
		FROM recent_tracks
		WHERE listened_at >= ? AND user = ?
		GROUP BY (listened_at / 86400)*86400
		ORDER BY (listened_at / 86400)*86400`,
		t.Unix(), u.ID).Scan(&result)
	return result
}

func (u *User) getListenedTotalRecentTrackSince(t time.Time) int64 {
	var result int64
	config.DB.Raw(`SELECT SUM(tracks.information_track_length)
		FROM recent_tracks INNER JOIN tracks
			ON tracks.track_id = recent_tracks.track
		WHERE listened_at >= ? AND user = ?`, t.Unix(), u.ID).Scan(&result)
	return result
}

type RecentTracksStatisticsStruct struct {
	Count         int
	TopTracks     []RecentTracksStatisticsStructTrack
	Hours         map[int]int
	Days          map[int]int
	TotalListened int
}

type RecentTracksStatisticsStructTrack struct {
	Count  int
	Name   string
	Artist string
	Image  string
	URI    string
}

func (u *User) RecentTracksStatistics(t time.Time) RecentTracksStatisticsStruct {
	tr := u.getTopRecentTrackSince(t)
	var countMap = map[string]int{}
	result := RecentTracksStatisticsStruct{}
	result.Count = len(tr)

	result.TopTracks = make([]RecentTracksStatisticsStructTrack, 0)
	list := []*tracks.Track{}
	for _, s := range tr {
		fromDB := tracks.GetTrackFromID(s.Track)
		countMap[s.Track] = s.Count
		list = append(list, fromDB)
	}
	tracks.BatchUpdate(list, *u.Client())
	for _, s := range list {
		result.TopTracks = append(result.TopTracks, RecentTracksStatisticsStructTrack{
			Count:  countMap[s.TrackID],
			Name:   s.Name,
			Artist: s.ArtistString(),
			Image:  s.Information.TrackInformation.Image,
			URI:    s.TrackID,
		})
	}

	// Put the data extracted from the database and set the value to 0 where it is not already set
	hours := u.getListenedHoursRecentTrackSince(t)
	result.Hours = make(map[int]int)
	for _, s := range hours {
		result.Hours[s.Time] = s.Count
	}
	for i := 0; i <= 23; i++ {
		if _, ok := result.Hours[i]; !ok {
			result.Hours[i] = 0
		}
	}

	days := u.getListenedDaysRecentTrackSince(t)
	result.Days = make(map[int]int)
	for _, s := range days {
		result.Days[s.Time] = s.Count
	}

	result.TotalListened = int(u.getListenedTotalRecentTrackSince(t) / 1000)
	return result
}
