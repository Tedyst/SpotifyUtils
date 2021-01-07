import React, { useState, useEffect } from 'react';
import {
    useParams
} from "react-router-dom";
import { Grid, Container } from '@material-ui/core';
import TrackInfo from './TrackInfo';
import AlbumInfo from './AlbumInfo';
import Chart1 from './Chart1';
import Chart2 from './Chart2';
import Lyrics from './Lyrics';
import SongCard from '../../components/SongCardRight';
import {
    Redirect,
} from "react-router-dom";
import Loading from '../Loading';


interface ParamTypes {
    trackid: string
}

export default function TrackAnalyze() {
    let { trackid } = useParams<ParamTypes>();
    const [trackInfo, setTrackInfo] = useState<{
        Success: boolean,
        Lyrics: string,
        Information: {
            TrackInformation: {
                LoudnessGraph: any,
                Image: string,
                Popularity: number,
                Length: number,
                Markets: number,
                Explicit: boolean,
                Key: number,
                Mode: number,
                Tempo: number,
                TimeSignature: number,
            },
            AlbumInformation: {
                Popularity: string,
                ReleaseDate: string,
                TracksAmount: string,
                Markets: string
            },
            TrackFeatures: {
                Acousticness: number,
                Danceability: number,
                Energy: number,
                Instrumentalness: number,
                Liveness: number,
                Loudness: number,
                Speechiness: number,
            }
        },
        Artist: string,
        Name: string,

    }>();
    const [returnToTrackSearch, setReturn] = useState(false);

    useEffect(() => {
        fetch('/api/track/' + trackid, { cache: "no-store", credentials: "same-origin" }).then(res => res.json()).then(data => {
            if (data.Success)
                setTrackInfo(data.Result);
            else
                setReturn(true);
        });
    }, [trackid])

    if (returnToTrackSearch) {
        return <Redirect to="/tracksearch" />;
    }

    if (trackInfo === null || trackInfo === undefined) {
        return <Loading />
    }
    if (trackInfo.Success === false) {
        return <Redirect to="/" />;
    }
    let lyrics = trackInfo.Lyrics ? (<Grid item xs={12}>
        <Container maxWidth="sm">
            <Lyrics
                lyrics={trackInfo.Lyrics}
            />
        </Container>
    </Grid>) : null;

    let chart = trackInfo.Information.TrackInformation.LoudnessGraph ? (<Grid item xs={12}>
        <Chart1
            data={trackInfo.Information.TrackInformation.LoudnessGraph}
        />
    </Grid>) : null;
    return (
        <div>
            <Container maxWidth="xs">
                <SongCard
                    artist={trackInfo.Artist}
                    name={trackInfo.Name}
                    image={trackInfo.Information.TrackInformation.Image}
                />
            </Container>
            <br />
            <Grid container spacing={3}>
                <Grid item lg={6} xs={12}>
                    <TrackInfo
                        popularity={trackInfo.Information.TrackInformation.Popularity}
                        length={trackInfo.Information.TrackInformation.Length}
                        markets={trackInfo.Information.TrackInformation.Markets}
                        explicit={trackInfo.Information.TrackInformation.Explicit}
                        track_key={trackInfo.Information.TrackInformation.Key}
                        mode={trackInfo.Information.TrackInformation.Mode}
                        tempo={trackInfo.Information.TrackInformation.Tempo}
                        time_signature={trackInfo.Information.TrackInformation.TimeSignature}
                    />
                </Grid>
                <Grid item lg={6} xs={12}>
                    <AlbumInfo
                        popularity={trackInfo.Information.AlbumInformation.Popularity}
                        release_date={trackInfo.Information.AlbumInformation.ReleaseDate}
                        tracks={trackInfo.Information.AlbumInformation.TracksAmount}
                        markets={trackInfo.Information.AlbumInformation.Markets}
                    />
                    <br />
                    <Chart2
                        acousticness={trackInfo.Information.TrackFeatures.Acousticness}
                        danceability={trackInfo.Information.TrackFeatures.Danceability}
                        energy={trackInfo.Information.TrackFeatures.Energy}
                        instrumentalness={trackInfo.Information.TrackFeatures.Instrumentalness}
                        liveness={trackInfo.Information.TrackFeatures.Liveness}
                        loudness={(60 + trackInfo.Information.TrackFeatures.Loudness) / 60}
                        speechiness={trackInfo.Information.TrackFeatures.Speechiness}
                    />
                </Grid>
                {chart}
                <Grid item xs={12}>
                    {lyrics}
                </Grid>

            </Grid>
        </div>);
}
