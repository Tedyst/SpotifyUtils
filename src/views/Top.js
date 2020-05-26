import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  selectTop,
  setTop
} from '../store/user';
import { useSelector, useDispatch } from 'react-redux';
import Container from '@material-ui/core/Container';
import { Grid } from '@material-ui/core';
import ArtistCard from '../sections/Top/ArtistCard';
import SongCard from '../sections/Top/SongCard';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1
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
            return 
    }
}


export default function Top(){
    const top = useSelector(selectTop);
    const classes = useStyles();
    const [Updating, setUpdating] = useState(false);
    const dispatch = useDispatch();
    if(Object.keys(top["artists"]).length === 0 && Updating === false){
        setUpdating(true);
        fetch('/top/me').then(res => res.json()).then(data => {
            dispatch(setTop(data));
        });
    }
    console.log(top);
    let artists = [];
    let tracks = [];
    for(var val in top["artists"]){
        artists.push(<Grid item key={top["artists"][val].id}>
            <ArtistCard
                key={top["artists"][val].id}
                name={top["artists"][val].name}
                image={top["artists"][val].image}
                secondary={"Test"}
                height={200}
            />
        </Grid>);
        break;
    }
    for(var val in top["tracks"]){
        tracks.push(<Grid item key={top["tracks"][val].id}>
            <SongCard
                key={top["tracks"][val].id}
                name={top["tracks"][val].name}
                artist={top["tracks"][val].artist}
                image={top["tracks"][val].image}
            />
        </Grid>);
        break;
    }

    let topArtist = null;
    if(top["artists"].length > 0)
        topArtist = (<Grid item key={top["artists"][0].id}>
            <ArtistCard
                key={top["artists"][0].id}
                name={top["artists"][0].name}
                image={top["artists"][0].image}
                secondary={"Test"}
                height={200}
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
                secondary={
                    "When you only have "
                }
            />
        </Grid>)

    return (
        <Container maxWidth="sm">
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
    )
}