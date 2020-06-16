import React, { useState } from 'react';
import {
  useParams
} from "react-router-dom";
import { Grid } from '@material-ui/core';
import TrackInfo from './TrackInfo';
import AlbumInfo from './AlbumInfo';
import Chart1 from './Chart1';
import Chart2 from './Chart2';
import Lyrics from './Lyrics';
import SongCard from '../Top/SongCard';
import {
  Redirect,
} from "react-router-dom";
import Container from '@material-ui/core/Container';

export default function TrackAnalyze(props){
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
    let lyrics = trackInfo.track.lyrics ? (<Grid item xs={12}>
            <Container maxWidth="sm">
                <Lyrics 
                    lyrics={trackInfo.track.lyrics}
                />
            </Container>
        </Grid>) : null;
    return (<Grid container spacing={3}>
        <Grid item xs={12}>
            <Container maxWidth="xs">
                <SongCard 
                    artist={trackInfo.track.artist}
                    name={trackInfo.track.name}
                    image={trackInfo.track.image_url}
                />
            </Container>
        </Grid>
        <Grid item xs={6}>
            <TrackInfo 
                popularity={trackInfo.analyze.popularity}
                length={trackInfo.analyze.length}
                markets={trackInfo.analyze.markets}
                explicit={trackInfo.analyze.explicit ? "Yes" : "No"}
                track_key={trackInfo.analyze.key}
                mode={trackInfo.analyze.mode === 0 ? "Minor" : "Major"}
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
        {lyrics}
    </Grid>);
}

function Loading(){
    return "Loading...";
}