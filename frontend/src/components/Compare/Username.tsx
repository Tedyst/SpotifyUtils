import React from 'react';
import {
    useParams
} from "react-router-dom";
import {
    makeStyles,
    Container,
    Grid,
    Typography,
} from '@material-ui/core';
import ArtistCard from '../ArtistCard';
import SongCard from '../SongCardRight';
import ListItems from '../ItemList';
import Avatars from '../Avatars';
import {
    Redirect
} from "react-router-dom";
import axios from 'axios';
import {
    useQuery
} from 'react-query';
import Loading from '../Loading';
import NoUsername from './NoUsername';

const useStyles = makeStyles(() => ({
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

function msToText(ms: number) {
    let seconds = Math.floor(ms / 1000);
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    const hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    if (hours !== 0) {
        return hours + " Hours";
    }
    if (minutes !== 0) {
        if (seconds !== 0) {
            return minutes + " Minutes and " + seconds + " Seconds";
        }
        return minutes + " Minutes";
    }
    return seconds + " Seconds";
}

interface ParamTypes {
    code: string
}

export interface UsernameInterface {
    initiator: Initiator;
    target: Initiator;
    result: Result;
    success: boolean;
}

export interface Initiator {
    username: string;
    name: string;
    image: string;
    code: string;
}

export interface Result {
    artists: Artist[];
    tracks: Track[];
    genres: string[];
    percent: number;
}

export interface Artist {
    name: string;
    image: string;
    id: string;
}

export interface Track {
    artist: string;
    name: string;
    image: string;
    id: string;
    duration: number;
    preview_url: string;
}


export interface Friend {
    username: string;
    name: string;
    image: string;
    code: string;
}


export default function Username(props: {
    Word: string,
    setWord: React.Dispatch<React.SetStateAction<string>>
}) {
    const classes = useStyles();
    const { code } = useParams<ParamTypes>();
    const sanitizedCode = code.replace(/[^a-zA-Z]+/g, '');
    if (sanitizedCode.length != 6) {
        return <Redirect to="/compare" />;
    }
    const { data, status } = useQuery(['compare', sanitizedCode], () =>
        axios.get<UsernameInterface>('/api/compare/' + sanitizedCode, {
            withCredentials: true
        }))
    const top = data?.data;
    if (status === "error" || data?.data.success === false) {
        return <Redirect to="/compare" />;
    }
    if (top === undefined || status === "loading") {
        return <Loading />;
    }

    if (top["success"] === false) {
        return (
            <NoUsername
                Word={props.Word}
                setWord={props.setWord}
            />
        )
    }
    let bestSongForArtist = undefined;
    if (top["result"]["artists"].length > 0) {
        for (let val in top["result"]["tracks"]) {
            if (top["result"]["tracks"][val].artist === top["result"]["artists"][0].name && bestSongForArtist === undefined) {
                bestSongForArtist = top["result"]["tracks"][val].name;
                break;
            }
        }
    }

    let topArtist = null;
    if (top["result"]["artists"].length > 0) {
        topArtist = (<Grid item key={top["result"]["artists"][0].id}>
            <ArtistCard
                bestSong={bestSongForArtist}
                image={top["result"]["artists"][0].image}
                key={top["result"]["artists"][0].id}
                name={top["result"]["artists"][0].name}
            />
        </Grid>);
    }
    let topTrack = null;
    if (top["result"]["tracks"].length > 0) {
        topTrack = (<Grid item key={top["result"]["tracks"][0].id}>
            <SongCard
                artist={top["result"]["tracks"][0].artist}
                duration={
                    msToText(top["result"]["tracks"][0].duration)
                }
                image={top["result"]["tracks"][0].image}
                key={top["result"]["tracks"][0].id}
                name={top["result"]["tracks"][0].name}
            />
        </Grid>)
    }

    let commonTopArtistTrackText = null;
    if (topArtist === null && topTrack === null) {
        commonTopArtistTrackText = (<Typography align="center" component="h5" variant="h5">
            Could not find any top tracks or artists that you both like
        </Typography>)
    }
    else if (topArtist === null) {
        commonTopArtistTrackText = (<Typography align="center" component="h5" variant="h5">
            You both like this track
        </Typography>)
    }
    else if (topTrack === null) {
        commonTopArtistTrackText = (<Typography align="center" component="h5" variant="h5">
            You both like this artist
        </Typography>)
    }
    else {
        commonTopArtistTrackText = (<Typography align="center" component="h5" variant="h5">
            You both like this artist and track
        </Typography>)
    }
    return (
        <div>
            <Container disableGutters={true} fixed={true} maxWidth="md">
                <Grid alignItems="center" container>
                    <Avatars
                        initiator={top["initiator"]}
                        target={top["target"]}
                    />
                </Grid>
                <Grid>
                    <br />
                    <Typography align="center" color="textPrimary" variant="h4">
                        You and 
{' '}
{top.target.name} are 
{' '}
<b>{top.result.percent}%</b> compatible!
                </Typography>
                    <Typography align="center" color="textSecondary" variant="subtitle1">
                        Here are the top common artists, tracks, and genres that you both share
                </Typography>
                </Grid>
                <Grid className={classes.spacer} />
            </Container>
            <Container disableGutters={true} fixed={true} maxWidth="xs">
                <Grid>
                    {commonTopArtistTrackText}
                    <br />
                </Grid>
                <Grid alignItems="stretch" className={classes.root} container direction="column" spacing={2}>
                    {topArtist}
                </Grid>
                <Grid alignItems="stretch" className={classes.root} container direction="column" spacing={2}>
                    {topTrack}
                </Grid>
            </Container>
            <br />
            <br />
            <Container maxWidth="xl">
                <Grid alignItems="stretch" className={classes.root} container direction="row" spacing={2}>
                    <Grid className={classes.fullWidth} item key="lista-tracks" md={4}>
                        <ListItems
                            items={top["result"]["tracks"]}
                            name={"Common Top Tracks"}
                        />
                    </Grid>
                    <Grid className={classes.fullWidth} item key="lista-artists" md={4}>
                        <ListItems
                            items={top["result"]["artists"]}
                            name={"Common Top Artists"}
                        />
                    </Grid>
                    <Grid className={classes.fullWidth} item key="lista-genres" md={4}>
                        <ListItems
                            items={top["result"]["genres"]}
                            name={"Common Top Genres"}
                        />
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}