import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import Container from '@material-ui/core/Container';
import { Grid } from '@material-ui/core';
import ArtistCard from '../sections/Top/ArtistCard';
import SongCard from '../sections/Top/SongCard';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import List from '../sections/Top/List';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1
    },
    fullWidth: {
        width: '100%'
    }
}));

function msToText(ms){
    let seconds = Math.floor(ms / 1000);
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    let hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    if(hours !== 0)
        return hours + " Hours";
    if(minutes !== 0){
        if(seconds !== 0)
            return minutes + " Minutes and " + seconds + " Seconds";
        return minutes + " Minutes";
    }
    return seconds + " Seconds";
}

export default function Compare(){
    let match = useRouteMatch();
    return (<Switch>
        <Route path={`${match.path}/:username`}>
            <Username />
        </Route>
        <Route path={match.path}>
            No username
        </Route>
    </Switch>);
}

function NoUsername(){
    return null;
}

function Username(){
    const classes = useStyles();
    const [Updating, setUpdating] = useState(false);
    const [top, setTop] = useState(
        {
            "artists": {},
            "tracks": {},
            "genres": {}
        }
    );
    let { username } = useParams();
    if(Object.keys(top["artists"]).length === 0 && Updating === false){
        setUpdating(true);
        fetch('/compare/' + username).then(res => res.json()).then(data => {
            setTop(data);
        });
    }
    let bestSongForArtist = null;
    for(var val in top["tracks"]){
        if(top["tracks"][val].artist === top["artists"][0].name && bestSongForArtist === null){
            bestSongForArtist = top["tracks"][val].name;
            break;
        }
    }

    let topArtist = null;
    if(top["artists"].length > 0)
        topArtist = (<Grid item key={top["artists"][0].id}>
            <ArtistCard
                key={top["artists"][0].id}
                name={top["artists"][0].name}
                image={top["artists"][0].image}
                bestSong={bestSongForArtist}
            />
        </Grid>);
    let topTrack = null;
    if(top["tracks"].length > 0)
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

    let commonTopArtistTrackText = null;
    if(topArtist === null && topTrack === null)
        commonTopArtistTrackText = (<Typography component="h5" variant="h5" align="center">
                Could not find any top tracks or artists that you both like
            </Typography>)
    else if(topArtist === null)
        commonTopArtistTrackText = (<Typography component="h5" variant="h5" align="center">
            You both like this track
        </Typography>)
    else if(topTrack === null)
        commonTopArtistTrackText = (<Typography component="h5" variant="h5" align="center">
            You both like this artist
        </Typography>)
    else 
        commonTopArtistTrackText = (<Typography component="h5" variant="h5" align="center">
            You both like this artist and track
        </Typography>)
    return (
        <div>
        <Container maxWidth="xs" disableGutters={true} fixed={true}>
            {commonTopArtistTrackText}
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
        <br />
        <br />
        <Container maxWidth="xl">
            <Grid container spacing={2} className={classes.root} direction="row" alignItems="stretch">
                <Grid item key="lista-tracks" md={4} className={classes.fullWidth}>
                    <List
                        items={top["tracks"]}
                        name={"Common Top Tracks"}
                    />
                </Grid>
                <Grid item key="lista-artists" md={4} className={classes.fullWidth}>
                    <List
                        items={top["artists"]}
                        name={"Common Top Artists"}
                    />
                </Grid>
                <Grid item key="lista-genres" md={4} className={classes.fullWidth}>
                    <List
                        items={top["genres"]}
                        name={"Common Top Genres"}
                    />
                </Grid>
            </Grid>
        </Container>
        </div>
    )
}

function Test(){
    let { username } = useParams();
    return "Username " + username;
}