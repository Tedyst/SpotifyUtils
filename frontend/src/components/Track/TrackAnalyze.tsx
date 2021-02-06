import React from 'react';
import {
    useParams
} from "react-router-dom";
import { Grid, Container } from '@material-ui/core';
import TrackInfo from './TrackInfo';
import AlbumInfo from './AlbumInfo';
import Chart2 from './Chart2';
import Lyrics from './Lyrics';
import SongCard from '../../components/SongCardRight';
import {
    Redirect,
} from "react-router-dom";
import Loading from '../Loading';
import axios from 'axios';
import { useQuery } from 'react-query';


interface ParamTypes {
    trackid: string
}

export interface TrackInterface {
    Result: Result;
    Success: boolean;
}

export interface Result {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: null;
    TrackID: string;
    Lyrics: string;
    LastUpdated: string;
    Artist: string;
    Name: string;
    Information: Information;
}

export interface Information {
    TrackInformation: TrackInformation;
    AlbumInformation: AlbumInformation;
    TrackFeatures: TrackFeatures;
}

export interface AlbumInformation {
    Popularity: number;
    ReleaseDate: string;
    TracksAmount: number;
    Markets: number;
    ID: string;
}

export interface TrackFeatures {
    Acousticness: number;
    Danceability: number;
    Energy: number;
    Instrumentalness: number;
    Liveness: number;
    Loudness: number;
    Speechiness: number;
}

export interface TrackInformation {
    Image: string;
    Popularity: number;
    Length: number;
    Markets: number;
    Explicit: boolean;
    Key: number;
    Mode: number;
    Tempo: number;
    TimeSignature: number;
}

export default function TrackAnalyze() {
    let { trackid } = useParams<ParamTypes>();
    const sanitizedTrack = trackid.replace(/[^a-zA-Z]+/g, '');
    const { data, status } = useQuery(['track', sanitizedTrack], () =>
        axios.get<TrackInterface>('/api/track/' + sanitizedTrack, {
            withCredentials: true
        }))
    if (status === "loading") {
        return <Loading />
    }
    if (status === "error") {
        return <Redirect to="/tracksearch" />
    }
    if (data === undefined) {
        return <Loading />
    }
    if (data.data.Success === false) {
        return <Redirect to="/tracksearch" />
    }
    let trackInfo = data.data.Result;

    if (trackInfo === null || trackInfo === undefined) {
        return <Loading />
    }
    let lyrics = trackInfo.Lyrics ? (<Grid item xs={12}>
        <Container maxWidth="sm">
            <Lyrics
                lyrics={trackInfo.Lyrics}
            />
        </Container>
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
                        explicit={trackInfo.Information.TrackInformation.Explicit}
                        length={trackInfo.Information.TrackInformation.Length}
                        markets={trackInfo.Information.TrackInformation.Markets}
                        mode={trackInfo.Information.TrackInformation.Mode}
                        popularity={trackInfo.Information.TrackInformation.Popularity}
                        tempo={trackInfo.Information.TrackInformation.Tempo}
                        timeSignature={trackInfo.Information.TrackInformation.TimeSignature}
                        track_key={trackInfo.Information.TrackInformation.Key}
                    />
                </Grid>
                <Grid item lg={6} xs={12}>
                    <AlbumInfo
                        popularity={trackInfo.Information.AlbumInformation.Popularity}
                        releaseDate={trackInfo.Information.AlbumInformation.ReleaseDate}
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
                <Grid item xs={12}>
                    {lyrics}
                </Grid>

            </Grid>
        </div>);
}
