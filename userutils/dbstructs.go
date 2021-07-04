package userutils

import (
	"database/sql/driver"
	"encoding/json"
	"log"

	"github.com/sirupsen/logrus"
)

type GenresStruct []string

func (sla *GenresStruct) Scan(value interface{}) error {
	switch v := value.(type) {
	case []byte:
		logrus.Tracef("Using []byte as type, value %v", v)
		return json.Unmarshal(value.([]byte), &sla)
	case string:
		logrus.Tracef("Using string as type, value %v", v)
		return json.Unmarshal([]byte(value.(string)), &sla)
	default:
		log.Panic("Not found interface type")
	}
	return nil
}

func (sla GenresStruct) Value() (driver.Value, error) {
	val, err := json.Marshal(sla)
	return string(val), err
}

type ArtistsStruct []TopArtist

func (sla *ArtistsStruct) Scan(value interface{}) error {
	switch v := value.(type) {
	case []byte:
		logrus.Tracef("Using []byte as type, value %v", v)
		return json.Unmarshal(value.([]byte), &sla)
	case string:
		logrus.Tracef("Using string as type, value %v", v)
		return json.Unmarshal([]byte(value.(string)), &sla)
	default:
		log.Panic("Not found interface type")
	}
	return nil
}

func (sla ArtistsStruct) Value() (driver.Value, error) {
	val, err := json.Marshal(sla)
	return string(val), err
}

type TracksStruct []TopTrack

func (sla *TracksStruct) Scan(value interface{}) error {
	switch v := value.(type) {
	case []byte:
		logrus.Tracef("Using []byte as type, value %v", v)
		return json.Unmarshal(value.([]byte), &sla)
	case string:
		logrus.Tracef("Using string as type, value %v", v)
		return json.Unmarshal([]byte(value.(string)), &sla)
	default:
		log.Panic("Not found interface type")
	}
	return nil
}

func (sla TracksStruct) Value() (driver.Value, error) {
	val, err := json.Marshal(sla)
	return string(val), err
}

type PlaylistsStruct []Playlist

func (sla *PlaylistsStruct) Scan(value interface{}) error {
	switch v := value.(type) {
	case []byte:
		logrus.Tracef("Using []byte as type, value %v", v)
		return json.Unmarshal(value.([]byte), &sla)
	case string:
		logrus.Tracef("Using string as type, value %v", v)
		return json.Unmarshal([]byte(value.(string)), &sla)
	default:
		log.Panic("Not found interface type")
	}
	return nil
}

func (sla PlaylistsStruct) Value() (driver.Value, error) {
	val, err := json.Marshal(sla)
	return string(val), err
}

type FriendsStruct []string

func (sla *FriendsStruct) Scan(value interface{}) error {
	switch v := value.(type) {
	case []byte:
		logrus.Tracef("Using []byte as type, value %v", v)
		return json.Unmarshal(value.([]byte), &sla)
	case string:
		logrus.Tracef("Using string as type, value %v", v)
		return json.Unmarshal([]byte(value.(string)), &sla)
	default:
		log.Panic("Not found interface type")
	}
	return nil
}

func (sla FriendsStruct) Value() (driver.Value, error) {
	val, err := json.Marshal(sla)
	return string(val), err
}

type Playlist struct {
	ID   string
	Name string
}
