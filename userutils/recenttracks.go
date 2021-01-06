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
	if u.Settings.RecentTracks == false {
		return
	}
	err := u.RefreshToken()
	if err != nil {
		return
	}
	log.Debugf("Updating recent tracks for %s", u.UserID)
	options := &spotify.RecentlyPlayedOptions{Limit: 50}
	items, err := u.Client().PlayerRecentlyPlayedOpt(options)
	if err != nil {
		log.Error(err)
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
		if u.Settings.RecentTracks == false {
			u.StopRecentTracksUpdater()
		}
		return
	}
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

func (u *User) GetRecentTracks() []spotify.RecentlyPlayedItem {
	options := &spotify.RecentlyPlayedOptions{Limit: 50}
	items, err := u.Client().PlayerRecentlyPlayedOpt(options)
	if err != nil {
		log.Error(err)
		return []spotify.RecentlyPlayedItem{}
	}
	if u.Settings.RecentTracks == true {
		u.insertRecentTracks(items)
	}

	list := []*tracks.Track{}
	for _, s := range items {
		t := tracks.GetTrackFromID(string(s.Track.ID))
		list = append(list, t)
	}
	tracks.BatchUpdate(list, *u.Client())

	return items
}

func (u *User) GetRecentTrackSince(t time.Time) []RecentTracks {
	var result []RecentTracks
	config.DB.Where("listened_at >= ?", t.Unix()).Where("user = ?", fmt.Sprint(u.ID)).Find(&result)
	return result
}

func (u *User) getTopRecentTrackSince(t time.Time) ([]RecentTracks, int64) {
	var result []RecentTracks
	var trackscount int64
	config.DB.Model(&RecentTracks{}).Select("COUNT(id) AS id, track").Where("listened_at >= ?", t.Unix()).Where("user = ?", fmt.Sprint(u.ID)).Group("track").Order("COUNT(id) DESC").Limit(100).Find(&result)
	if len(result) == 0 {
		return result, 0
	}
	config.DB.Model(&RecentTracks{}).Where("listened_at >= ?", t.Unix()).Where("user = ?", fmt.Sprint(u.ID)).Count(&trackscount)
	return result, trackscount
}

func (u *User) getListenedHoursRecentTrackSince(t time.Time) []RecentTracks {
	var result []RecentTracks
	config.DB.Model(&RecentTracks{}).Select("COUNT(*) AS id, FLOOR((listened_at % 86400)/3600) AS listened_at").Where(
		"listened_at >= ?", t.Unix()).Where("user = ?", fmt.Sprint(u.ID)).Group("FLOOR((listened_at % 86400)/3600)").Order(
		"FLOOR((listened_at % 86400)/3600)").Find(&result)
	return result
}

func (u *User) getListenedDaysRecentTrackSince(t time.Time) []RecentTracks {
	var result []RecentTracks
	config.DB.Model(&RecentTracks{}).Select("COUNT(*) AS id, FLOOR(listened_at / 86400)*86400 AS listened_at").Where(
		"listened_at >= ?", t.Unix()).Where("user = ?", fmt.Sprint(u.ID)).Group("FLOOR(listened_at / 86400)*86400").Order(
		"FLOOR(listened_at / 86400)*86400").Find(&result)
	return result
}

func (u *User) getListenedTotalRecentTrackSince(t time.Time) int64 {
	var result int64
	config.DB.Raw(`SELECT SUM(tracks.information_track_length)
		FROM recent_tracks INNER JOIN tracks
			ON tracks.track_id = recent_tracks.track
		WHERE listened_at >= ? AND user = ?;`, t.Unix(), u.ID).Scan(&result)
	return result
}

type RecentTracksStatisticsStruct struct {
	Count         int64
	TopTracks     []RecentTracksStatisticsStructTrack
	Hours         map[int64]uint
	Days          map[int64]uint
	TotalListened int
}

type RecentTracksStatisticsStructTrack struct {
	Count  uint
	Name   string
	Artist string
	Image  string
	URI    string
}

func (u *User) RecentTracksStatistics(t time.Time) RecentTracksStatisticsStruct {
	tr, count := u.getTopRecentTrackSince(t)
	result := RecentTracksStatisticsStruct{}
	result.Count = count
	// TopTracks
	result.TopTracks = make([]RecentTracksStatisticsStructTrack, 0)
	list := []*tracks.Track{}
	for _, s := range tr {
		fromDB := tracks.GetTrackFromID(s.Track)
		list = append(list, fromDB)
	}
	tracks.BatchUpdate(list, *u.Client())
	for _, s := range list {
		result.TopTracks = append(result.TopTracks, RecentTracksStatisticsStructTrack{
			Count:  s.ID,
			Name:   s.Name,
			Artist: s.Artist,
			Image:  s.Information.TrackInformation.Image,
			URI:    s.TrackID,
		})
	}

	hours := u.getListenedHoursRecentTrackSince(t)
	result.Hours = make(map[int64]uint)
	for _, s := range hours {
		result.Hours[s.ListenedAt] = s.ID
	}
	for i := int64(0); i <= 23; i++ {
		if _, ok := result.Hours[i]; !ok {
			result.Hours[i] = 0
		}
	}

	days := u.getListenedDaysRecentTrackSince(t)
	result.Days = make(map[int64]uint)
	for _, s := range days {
		result.Days[s.ListenedAt] = s.ID
	}

	result.TotalListened = int(u.getListenedTotalRecentTrackSince(t) / 1000)
	return result
}
