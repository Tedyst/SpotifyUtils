import React from 'react';
import {
    makeStyles, Container, Grid, Typography,
} from '@material-ui/core';
import { useQuery } from 'react-query';
import axios from 'axios';
import Alert from '@material-ui/lab/Alert';
import ArtistCard from '../components/ArtistCard';
import SongCard from '../components/SongCardRight';
import List from '../components/ItemList';
import Loading from '../components/Loading';

const useStyles = makeStyles(() => ({
    root: {
        flexGrow: 1,
    },
    fullWidth: {
        width: '100%',
    },
}));

function msToText(ms: number): string {
    let seconds = Math.floor(ms / 1000);
    let minutes = Math.floor(seconds / 60);
    seconds %= 60;
    const hours = Math.floor(minutes / 60);
    minutes %= 60;
    if (hours !== 0) return `${hours} Hours`;
    if (minutes !== 0) {
        if (seconds !== 0) return `${minutes} Minutes and ${seconds} Seconds`;
        return `${minutes} Minutes`;
    }
    return `${seconds} Seconds`;
}

export interface TopInterface {
    result: Result;
    success: boolean;
}

export interface Result {
    genres: string[];
    updated: number;
    artists: Artist[];
    tracks: Track[];
}

export interface Artist {
    name: string;
    image: string;
    id: string;
}

export interface Track {
    artist: string;
    name: string;
    image: string;
    id: string;
    duration: number;
    previewURL: string;
}

export default function Top() {
    const classes = useStyles();

    const { data, status, error } = useQuery('top', () => axios.get<TopInterface>('/api/top', {
        withCredentials: true,
    }));

    let errorComponent = null;
    if (status === 'error' || data?.data.success === false) {
        if (typeof error === 'object' && error != null) {
            if (error.toString() !== '') {
                errorComponent = (
                    <Container maxWidth="xs">
                        <Alert severity="error">{error.toString()}</Alert>
                    </Container>
                );
            }
        } else {
            errorComponent = (
                <Container maxWidth="xs">
                    <Alert severity="error">Could not extract data from server</Alert>
                </Container>
            );
        }
        return (
            <div>
                {errorComponent}
                <Loading />
            </div>
        );
    }
    if (data === undefined || status === 'loading') return <Loading />;
    const top = data?.data;

    if (top === undefined) {
        return <Loading />;
    }
    if (top.success === false) {
        return <Loading />;
    }

    let bestSongForArtist: string | undefined;
    Object.values(top.result.tracks).forEach((value) => {
        if (bestSongForArtist === undefined) {
            if (value.artist === top.result.artists[0].name) {
                bestSongForArtist = value.name;
            }
        }
    });

    let topArtist = null;
    if (top.result.artists.length > 0) {
        topArtist = (
            <Grid item key={top.result.artists[0].id}>
                <ArtistCard
                    bestSong={bestSongForArtist}
                    image={top.result.artists[0].image}
                    key={top.result.artists[0].id}
                    name={top.result.artists[0].name}
                />
            </Grid>
        );
    }
    let topTrack = null;
    if (top.result.tracks.length > 0) {
        topTrack = (
            <Grid item key={top.result.tracks[0].id}>
                <SongCard
                    artist={top.result.tracks[0].artist}
                    duration={
                        msToText(top.result.tracks[0].duration)
                    }
                    image={top.result.tracks[0].image}
                    key={top.result.tracks[0].id}
                    name={top.result.tracks[0].name}
                />
            </Grid>
        );
    }

    return (
        <div>
            <Container disableGutters fixed maxWidth="xs">
                <Typography component="h4" variant="h4" align="center">
                    Your top artists and tracks
                </Typography>
                <Typography variant="subtitle1" color="textSecondary" align="center">
                    Get ready to feel cool. Or much less cool than you thought
                </Typography>
                <br />
                <Grid container spacing={2} className={classes.root} direction="column" alignItems="stretch">
                    {topArtist}
                </Grid>
                <Grid container spacing={2} className={classes.root} direction="column" alignItems="stretch">
                    {topTrack}
                </Grid>
            </Container>
            <Container maxWidth="xl">
                <Grid container spacing={2} className={classes.root} direction="row" alignItems="stretch">
                    <Grid item key="lista-tracks" md={4} className={classes.fullWidth}>
                        <List
                            items={top.result.tracks}
                            name="Your Top Tracks"
                        />
                    </Grid>
                    <Grid item key="lista-artists" md={4} className={classes.fullWidth}>
                        <List
                            items={top.result.artists}
                            name="Your Top Artists"
                        />
                    </Grid>
                    <Grid item key="lista-genres" md={4} className={classes.fullWidth}>
                        <List
                            items={top.result.genres}
                            name="Your Top Genres"
                        />
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
}
