package userutils

import (
	"database/sql/driver"
	"encoding/json"

	"github.com/zmb3/spotify"
)

type GenresStruct []string

func (sla *GenresStruct) Scan(value interface{}) error {
	return json.Unmarshal([]byte(value.(string)), &sla)
}

func (sla GenresStruct) Value() (driver.Value, error) {
	val, err := json.Marshal(sla)
	return string(val), err
}

type ArtistsStruct []TopArtist

func (sla *ArtistsStruct) Scan(value interface{}) error {
	return json.Unmarshal([]byte(value.(string)), &sla)
}

func (sla ArtistsStruct) Value() (driver.Value, error) {
	val, err := json.Marshal(sla)
	return string(val), err
}

type TracksStruct []TopTrack

func (sla *TracksStruct) Scan(value interface{}) error {
	return json.Unmarshal([]byte(value.(string)), &sla)
}

func (sla TracksStruct) Value() (driver.Value, error) {
	val, err := json.Marshal(sla)
	return string(val), err
}

type PlaylistsStruct []spotify.SimplePlaylist

func (sla *PlaylistsStruct) Scan(value interface{}) error {
	return json.Unmarshal([]byte(value.(string)), &sla)
}

func (sla PlaylistsStruct) Value() (driver.Value, error) {
	val, err := json.Marshal(sla)
	return string(val), err
}
