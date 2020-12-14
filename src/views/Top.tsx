import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Grid } from '@material-ui/core';
import ArtistCard from '../sections/Top/ArtistCard';
import SongCard from '../components/SongCardRight';
import Typography from '@material-ui/core/Typography';
import List from '../components/ItemsList';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1
    },
    fullWidth: {
        width: '100%'
    }
}));

function msToText(ms: number): string {
    let seconds = Math.floor(ms / 1000);
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    let hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    if (hours !== 0)
        return hours + " Hours";
    if (minutes !== 0) {
        if (seconds !== 0)
            return minutes + " Minutes and " + seconds + " Seconds";
        return minutes + " Minutes";
    }
    return seconds + " Seconds";
}


export default function Top() {
    const [top, setTop] = useState<{
        result: {
            genres: string[],
            updated: number,
            artists: {
                name: string,
                image: string,
                id: string,
            }[],
            tracks: {
                artist: string,
                name: string,
                image: string,
                id: string,
                duration: number,
                preview_url: string,
            }[]
        },
        success: boolean
    }>();
    const classes = useStyles();

    useEffect(() => {
        fetch('/api/top', { cache: "no-store" }).then(res => res.json()).then(data => {
            setTop(data);
        });
    }, [])

    if(top === undefined){
        return null;
    }
    if (top.success === false) {
        return null;
    }

    let bestSongForArtist = null;
    for (var val in top.result.tracks) {
        if (top.result.tracks[val].artist === top.result.artists[0].name && bestSongForArtist === null) {
            bestSongForArtist = top.result.tracks[val].name;
            break;
        }
    }

    let topArtist = null;
    if (top.result.artists.length > 0)
        topArtist = (<Grid item key={top.result.artists[0].id}>
            <ArtistCard
                key={top.result.artists[0].id}
                name={top.result.artists[0].name}
                image={top.result.artists[0].image}
                bestSong={bestSongForArtist}
            />
        </Grid>);
    let topTrack = null;
    if (top.result.tracks.length > 0)
        topTrack = (<Grid item key={top.result.tracks[0].id}>
            <SongCard
                key={top.result.tracks[0].id}
                name={top.result.tracks[0].name}
                artist={top.result.tracks[0].artist}
                image={top.result.tracks[0].image}
                duration={
                    msToText(top.result.tracks[0].duration)
                }
            />
        </Grid>)

    return (
        <div>
            <Container maxWidth="xs" disableGutters={true} fixed={true}>
                <Typography component="h4" variant="h4" align="center">
                    Your top artist and track
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
                            name={"Your Top Tracks"}
                        />
                    </Grid>
                    <Grid item key="lista-artists" md={4} className={classes.fullWidth}>
                        <List
                            items={top.result.artists}
                            name={"Your Top Artists"}
                        />
                    </Grid>
                    <Grid item key="lista-genres" md={4} className={classes.fullWidth}>
                        <List
                            items={top.result.genres}
                            name={"Your Top Genres"}
                        />
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}