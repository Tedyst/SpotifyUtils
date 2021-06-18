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

function unixToTime(lastUpdated: number | undefined): string {
    if (!lastUpdated) {
        return '';
    }
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
    Result: Result;
    Success: boolean;
    Error: string;
}

interface Result {
    Genres: string[] | null;
    Updated: number;
    Artists: Artist[] | null;
    Tracks: Track[] | null;
}

interface Artist {
    Name: string;
    Image: string;
    ID: string;
}

interface Track {
    Artist: string;
    Name: string;
    Image: string;
    ID: string;
    Duration: number;
    PreviewURL: string;
}

export default function TopComp(props: {
    top: TopInterface | undefined,
}) {
    const classes = useStyles();

    const { top } = props;

    if (!top) {
        return null;
    }

    let bestSongForArtist: string | undefined;
    if (top?.Result?.Tracks) {
        Object.values(top.Result.Tracks).forEach((value) => {
            if (!bestSongForArtist && top?.Result?.Artists && top?.Result?.Artists?.length > 0) {
                if (value.Artist === top.Result.Artists[0].Name) {
                    bestSongForArtist = value.Name;
                }
            }
        });
    }

    let topArtist = null;
    if (top?.Result?.Artists && top?.Result?.Artists?.length > 0) {
        topArtist = (
            <Grid item key={top.Result.Artists[0].ID}>
                <ArtistCard
                    bestSong={bestSongForArtist}
                    image={top.Result.Artists[0].Image}
                    key={top.Result.Artists[0].ID}
                    name={top.Result.Artists[0].Name}
                />
            </Grid>
        );
    }

    let topTrack = null;
    if (top?.Result?.Tracks !== null && top?.Result?.Tracks?.length > 0) {
        topTrack = (
            <Grid item key={top.Result.Tracks[0].ID}>
                <SongCard
                    artist={top.Result.Tracks[0].Artist}
                    duration={top.Result.Tracks[0].Duration}
                    image={top.Result.Tracks[0].Image}
                    key={top.Result.Tracks[0].ID}
                    name={top.Result.Tracks[0].Name}
                />
            </Grid>
        );
    }

    const lastUpdated = `This page updated at ${unixToTime(top?.Result?.Updated)}`;
    return (
        <>
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
                            items={top.Result.Tracks}
                            name="Your Top Tracks"
                        />
                    </Grid>
                    <Grid item key="lista-artists" md={4} className={classes.fullWidth}>
                        <List
                            items={top.Result.Artists}
                            name="Your Top Artists"
                        />
                    </Grid>
                    <Grid item key="lista-genres" md={4} className={classes.fullWidth}>
                        <List
                            items={top.Result.Genres}
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
        </>
    );
}
