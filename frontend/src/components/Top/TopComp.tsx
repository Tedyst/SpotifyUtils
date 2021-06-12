import React from 'react';
import {
    makeStyles, Container, Grid, Typography,
} from '@material-ui/core';
import ArtistCard from '../ArtistCard';
import SongCard from '../SongCardRight';
import List from '../ItemList';

const useStyles = makeStyles(() => ({
    root: {
        flexGrow: 1,
    },
    fullWidth: {
        width: '100%',
    },
}));

function unixToTime(lastUpdated: number): string {
    const d = new Date(lastUpdated * 1000);
    const year = d.getFullYear();
    let month = `${d.getMonth() + 1}`;
    let day = `${d.getDate()}`;

    if (month.length < 2) {
        month = `0${month}`;
    }
    if (day.length < 2) {
        day = `0${day}`;
    }

    return [year, month, day].join('-');
}

export interface TopInterface {
    result: Result;
    success: boolean;
    error: string;
}

interface Result {
    genres: string[] | null;
    updated: number;
    artists: Artist[] | null;
    tracks: Track[] | null;
}

interface Artist {
    name: string;
    image: string;
    id: string;
}

interface Track {
    artist: string;
    name: string;
    image: string;
    id: string;
    duration: number;
    previewURL: string;
}

export default function TopComp(props: {
    top: TopInterface,
}) {
    const classes = useStyles();

    const { top } = props;

    let bestSongForArtist: string | undefined;
    if (top.result.tracks !== null) {
        Object.values(top.result.tracks).forEach((value) => {
            if (bestSongForArtist === undefined && top.result.artists !== null) {
                if (value.artist === top.result.artists[0].name) {
                    bestSongForArtist = value.name;
                }
            }
        });
    }

    let topArtist = null;
    if (top.result.artists !== null) {
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
    }
    let topTrack = null;
    if (top.result.tracks !== null) {
        if (top.result.tracks.length > 0) {
            topTrack = (
                <Grid item key={top.result.tracks[0].id}>
                    <SongCard
                        artist={top.result.tracks[0].artist}
                        duration={top.result.tracks[0].duration}
                        image={top.result.tracks[0].image}
                        key={top.result.tracks[0].id}
                        name={top.result.tracks[0].name}
                    />
                </Grid>
            );
        }
    }

    const lastUpdated = `This page updated at ${unixToTime(top.result.updated)}`;
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
            <Container disableGutters fixed maxWidth="xs">
                <Typography component="h6" color="textSecondary" align="center">
                    {lastUpdated}
                </Typography>
            </Container>
        </div>
    );
}
