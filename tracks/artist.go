package tracks

import (
	"github.com/tedyst/spotifyutils/config"
	"github.com/zmb3/spotify"
	"gorm.io/gorm"
)

type Artist struct {
	gorm.Model
	ArtistID   string `gorm:"type:VARCHAR(30) NOT NULL UNIQUE"`
	Name       string
	Genres     []string
	Popularity int16
	Image      string
}

func GetArtistFromID(ID string) *Artist {
	var ar Artist
	config.DB.Where("artist_id = ?", ID).FirstOrCreate(&ar, Artist{
		ArtistID: ID,
	})
	return &ar
}

func (a *Artist) Update(cl *spotify.Client) {

}
