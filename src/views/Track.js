import React, { useState } from 'react';
import {
  Switch,
  Route,
  useRouteMatch,
  useParams
} from "react-router-dom";
import { Grid } from '@material-ui/core';
import TrackInfo from '../sections/Track/TrackInfo';
import AlbumInfo from '../sections/Track/AlbumInfo';
import Chart1 from '../sections/Track/Chart1';
import Chart2 from '../sections/Track/Chart2';
import Lyrics from '../sections/Track/Lyrics';
import SongCard from '../sections/Top/SongCard';
import {
  Redirect,
} from "react-router-dom";
import Container from '@material-ui/core/Container';

export default function Track(){
    let match = useRouteMatch();
    return (<Switch>
        <Route path={`${match.path}/:trackid`}>
            <TrackAnalyze />
        </Route>
        <Route path="/">
            <NoTrack />
        </Route>
    </Switch>);
}

function Loading(){
    return "Loading...";
}


function TrackAnalyze(props){
    const [Updating, setUpdating] = useState(null);
    let { trackid } = useParams();
    const [trackInfo, setTrackInfo] = useState(null);
    if(trackInfo === null && Updating === null){
        setUpdating(trackid);
        fetch('/api/track/' + trackid).then(res => res.json()).then(data => {
            setTrackInfo(data);
            if(data.success)
                setUpdating(trackid);
            else
                setUpdating(trackid);
        });
        return <Loading />;
    } else if(trackInfo === null && Updating !== null) {
        return <Loading />;
    } else if(trackInfo === null){
        return <Redirect to="/" />;
    }
    if(trackInfo["success"] === false) {
        return <Redirect to="/" />;
    }
    console.log(trackInfo);
    return (<Grid container spacing={3}>
        <Grid item xs={12}>
            <Container maxWidth="xs">
                <SongCard 
                    artist={trackInfo.track.artist}
                    name={trackInfo.track.name}
                    image="https://i.scdn.co/image/ab67616d0000b273ad3a902d81a73c73e58071b7"
                />
            </Container>
        </Grid>
        <Grid item xs={6}>
            <TrackInfo 
                popularity="asd"
                length="asd"
                markets="asd"
                explicit="asd"
                track_key={trackInfo.analyze.key}
                mode={trackInfo.analyze.mode}
                tempo={trackInfo.analyze.tempo}
                time_signature={trackInfo.analyze.time_signature}
            />
        </Grid>
        <Grid item xs={6}>
            <AlbumInfo 
                popularity="asd"
                release_date="asd"
                tracks="asd"
                markets="asd"
            />
            <br />
            <Chart2
                acousticness={trackInfo.analyze.acousticness}
                danceability={trackInfo.analyze.danceability}
                energy={trackInfo.analyze.energy}
                instrumentalness={trackInfo.analyze.instrumentalness}
                liveness={trackInfo.analyze.liveness}
                loudness={(60+trackInfo.analyze.loudness)/60}
                speechiness={trackInfo.analyze.speechiness}
            />
        </Grid>
        <Grid item xs={12}>
            <Chart1 
                data={trackInfo.analyze.loudness_graph}
            />
        </Grid>
        <Grid item xs={12}>
            <Container maxWidth="sm">
                <Lyrics 
                    lyrics={trackInfo.track.lyrics}
                />
            </Container>
        </Grid>
    </Grid>);
}

function NoTrack(props){
    return <Redirect to="/" />;
}