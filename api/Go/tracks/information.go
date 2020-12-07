package tracks

import "github.com/zmb3/spotify"

type TrackFeaturesStruct struct {
	Acousticness     float32
	Energy           float32
	Instrumentalness float32
	Liveness         float32
	Loudness         float32
	Speechiness      float32
	LoudnessGraph    []int
}

type TrackInformationStruct struct {
	Popularity    int     `json:"popularity"`
	Length        int     `json:"length"`
	Markets       int     `json:"markets"`
	Explicit      bool    `json:"explicit"`
	Key           int     `json:"key"`
	Mode          int     `json:"mode"`
	Tempo         float64 `json:"tempo"`
	TimeSignature int     `json:"time_signature"`
}

type AlbumInformationStruct struct {
	Popularity   int
	ReleaseDate  string
	TracksAmount int
	Markets      int
}

type SpotifyInformation struct {
	TrackInformation TrackInformationStruct
	AlbumInformation AlbumInformationStruct
	TrackFeatures    TrackFeaturesStruct
	Updated          bool
}

func (t *Track) updateInformation(cl spotify.Client) error {
	if t.Information.Updated == true {
		return nil
	}
	features, err := cl.GetAudioFeatures(spotify.ID(t.ID))
	if err != nil {
		return err
	}
	track, err := cl.GetTrack(spotify.ID(t.ID))
	if err != nil {
		return err
	}
	analysis, err := cl.GetAudioAnalysis(spotify.ID(t.ID))
	if err != nil {
		return err
	}
	album, err := cl.GetAlbum(spotify.ID(t.ID))
	if err != nil {
		return err
	}
	t.Information.Updated = true
	t.Information.TrackFeatures.Acousticness = features[0].Acousticness
	t.Information.TrackFeatures.Energy = features[0].Energy
	t.Information.TrackFeatures.Instrumentalness = features[0].Instrumentalness
	t.Information.TrackFeatures.Liveness = features[0].Liveness
	t.Information.TrackFeatures.Loudness = features[0].Loudness
	t.Information.TrackFeatures.Speechiness = features[0].Speechiness

	t.Information.TrackInformation.Explicit = track.Explicit
	t.Information.TrackInformation.Key = int(analysis.Track.Key)
	t.Information.TrackInformation.Length = track.Duration
	t.Information.TrackInformation.Markets = len(track.AvailableMarkets)
	t.Information.TrackInformation.Mode = int(analysis.Track.Mode)
	t.Information.TrackInformation.Popularity = track.Popularity
	t.Information.TrackInformation.Tempo = analysis.Track.Tempo
	t.Information.TrackInformation.TimeSignature = analysis.Track.TimeSignature

	t.Information.AlbumInformation.Markets = len(album.AvailableMarkets)
	t.Information.AlbumInformation.ReleaseDate = album.ReleaseDate
	t.Information.AlbumInformation.TracksAmount = album.Tracks.Total
	t.Information.AlbumInformation.Popularity = album.Popularity

	return nil
}
