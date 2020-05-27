import React, { useState } from 'react';
import {
  Switch,
  Route,
  useRouteMatch,
  useParams
} from "react-router-dom";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Grid } from '@material-ui/core';
import ArtistCard from '../sections/Top/ArtistCard';
import SongCard from '../sections/Top/SongCard';
import Typography from '@material-ui/core/Typography';
import List from '../sections/Top/List';
import Avatar from '@material-ui/core/Avatar';
import { deepOrange } from '@material-ui/core/colors';
import Avatars from '../sections/Compare/Avatars';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1
    },
    fullWidth: {
        width: '100%'
    },
    spacer: {
        height: 100
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
        <Route path={`${match.path}/:code`}>
            <Username />
        </Route>
        <Route path={match.path}>
            <Test />
        </Route>
    </Switch>);
}


function Username(){
    const classes = useStyles();
    const [Updating, setUpdating] = useState(false);
    let { code } = useParams();
    const [top, setTop] = useState(null);
    if(top === null && Updating === false){
        setUpdating(true);
        fetch('/compare/' + code).then(res => res.json()).then(data => {
            setTop(data);
        });
        return <Test />;
    } else if(top === null){
        return <Test />;
    }
    if(top["success"] === false){
        return (
            <Test 
                error={"User does not exist"}
            />
        )
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
            <Grid container alignItems="center">
                <Avatars 
                    initiator={top["initiator"]}
                    target={top["target"]}
                />
            </Grid>
            <Grid>
                <br />
                <Typography variant="h4" color="textPrimary" align="center">
                    You two are <b>{top["percent"]}%</b> compatible!
                </Typography>
                <Typography variant="subtitle1" color="textSecondary" align="center">
                    Here are the top common artists, tracks, and genres that you both share
                </Typography>
            </Grid>
            <Grid className={classes.spacer}>

            </Grid>
            <Grid>
                {commonTopArtistTrackText}
                <br />
            </Grid>
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

function Test(props){
    const [code, setCode] = useState("");
    const [friends, setFriends] = useState([]);
    const [updating, setUpdating] = useState(false);
    if (updating === false){
        fetch('/compare/').then(res => res.json()).then(data => {
            setCode(data["code"]);
            setFriends(data["friends"]);
        });
        setUpdating(true);
    }
    
    // console.log(code, friends);
    if(props.error)
        return props.error
    return "No username";
}