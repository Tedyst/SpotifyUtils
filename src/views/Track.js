import React, { useState } from 'react';
import {
  Switch,
  Route,
  useRouteMatch,
  useParams
} from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Grid } from '@material-ui/core';
import ArtistCard from '../sections/Top/ArtistCard';
import SongCard from '../sections/Top/SongCard';
import Typography from '@material-ui/core/Typography';
import ListItems from '../sections/Top/List';
import Avatars from '../components/Avatars';
import {
  selectCompare
} from '../store/user';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Avatar from '../components/Avatar';
import Button from '@material-ui/core/Button';
import {
  Redirect,
} from "react-router-dom";

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
    const classes = useStyles();
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
    return "Loaded";
}

function NoTrack(props){
    return <Redirect to="/" />;
}