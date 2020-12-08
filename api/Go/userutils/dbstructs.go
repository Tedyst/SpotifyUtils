package userutils

import (
	"database/sql/driver"
	"encoding/json"
)

type GenresStruct []string

func (sla *GenresStruct) Scan(value interface{}) error {
	return json.Unmarshal(value.([]byte), &sla)
}

func (sla GenresStruct) Value() (driver.Value, error) {
	val, err := json.Marshal(sla)
	return string(val), err
}

type ArtistsStruct []TopArtist

func (sla *ArtistsStruct) Scan(value interface{}) error {
	return json.Unmarshal(value.([]byte), &sla)
}

func (sla ArtistsStruct) Value() (driver.Value, error) {
	val, err := json.Marshal(sla)
	return string(val), err
}

type TracksStruct []TopTrack

func (sla *TracksStruct) Scan(value interface{}) error {
	return json.Unmarshal(value.([]byte), &sla)
}

func (sla TracksStruct) Value() (driver.Value, error) {
	val, err := json.Marshal(sla)
	return string(val), err
}

type PlaylistsStruct []Playlist

func (sla *PlaylistsStruct) Scan(value interface{}) error {
	return json.Unmarshal(value.([]byte), &sla)
}

func (sla PlaylistsStruct) Value() (driver.Value, error) {
	val, err := json.Marshal(sla)
	return string(val), err
}

type Playlist struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}
