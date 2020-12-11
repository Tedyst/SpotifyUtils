import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    selectTop
} from '../store/user';
import { useSelector } from 'react-redux';
import Container from '@material-ui/core/Container';
import { Grid } from '@material-ui/core';
import ArtistCard from '../sections/Top/ArtistCard';
import SongCard from '../sections/Top/SongCard';
import Typography from '@material-ui/core/Typography';
import List from '../sections/Top/List';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1
    },
    fullWidth: {
        width: '100%'
    }
}));

function msToText(ms) {
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
    const top = useSelector(selectTop);
    const classes = useStyles();
    let bestSongForArtist = null;
    for (var val in top["tracks"]) {
        if (top["tracks"][val].artist === top["artists"][0].name && bestSongForArtist === null) {
            bestSongForArtist = top["tracks"][val].name;
            break;
        }
    }

    let topArtist = null;
    if (top["artists"].length > 0)
        topArtist = (<Grid item key={top["artists"][0].id}>
            <ArtistCard
                key={top["artists"][0].id}
                name={top["artists"][0].name}
                image={top["artists"][0].image}
                bestSong={bestSongForArtist}
            />
        </Grid>);
    let topTrack = null;
    if (top["tracks"].length > 0)
        topTrack = (<Grid item key={top["tracks"][0].id}>
            <SongCard
                key={top["tracks"][0].id}
                name={top["tracks"][0].name}
                artist={top["tracks"][0].artist}
                image={top["tracks"][0].image}
                duration={
                    msToText(top["tracks"][0].duration)
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
                            items={top["tracks"]}
                            name={"Your Top Tracks"}
                        />
                    </Grid>
                    <Grid item key="lista-artists" md={4} className={classes.fullWidth}>
                        <List
                            items={top["artists"]}
                            name={"Your Top Artists"}
                        />
                    </Grid>
                    <Grid item key="lista-genres" md={4} className={classes.fullWidth}>
                        <List
                            items={top["genres"]}
                            name={"Your Top Genres"}
                        />
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}