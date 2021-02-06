import React from 'react';
import {
    Switch,
    Route,
    useRouteMatch,
    useParams
} from "react-router-dom";
import { makeStyles, Container, Grid, Typography, TextField, List, ListItem, ListItemText, ListSubheader, Button } from '@material-ui/core';
import ArtistCard from '../components/ArtistCard';
import SongCard from '../components/SongCardRight';
import ListItems from '../components/ItemList';
import Avatars from '../components/Avatars';
import { Link } from 'react-router-dom';
import Avatar from '../components/Avatar';
import {
    Redirect,
} from "react-router-dom";
import axios from 'axios';
import { useQuery } from 'react-query';
import Loading from '../components/Loading';

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

function msToText(ms: number) {
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

export default function Compare() {
    let match = useRouteMatch();
    const [Word, setWord] = React.useState('');
    return (<Switch>
        <Route path={`${match.path}/:code`}>
            <Username
                Word={Word}
                setWord={setWord}
            />
        </Route>
        <Route path="/">
            <NoUsername
                Word={Word}
                setWord={setWord}
            />
        </Route>
    </Switch>);
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



export interface NoUsernameCompareInterface {
    friends: Friend[];
    success: boolean;
    code: string;
}

export interface Friend {
    username: string;
    name: string;
    image: string;
    code: string;
}


function Username(props: {
    Word: string,
    setWord: React.Dispatch<React.SetStateAction<string>>
}) {
    const classes = useStyles();
    const { code } = useParams<ParamTypes>();
    let sanitizedCode = code.replace(/[^a-zA-Z]+/g, '');
    if (sanitizedCode.length != 6) {
        return <Redirect to="/compare" />;
    }
    const { data, status } = useQuery(['compare', sanitizedCode], () =>
        axios.get<UsernameInterface>('/api/compare/' + sanitizedCode, {
            withCredentials: true
        }))
    let top = data?.data;
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
    if (top["result"]["artists"].length > 0)
        for (var val in top["result"]["tracks"]) {
            if (top["result"]["tracks"][val].artist === top["result"]["artists"][0].name && bestSongForArtist === undefined) {
                bestSongForArtist = top["result"]["tracks"][val].name;
                break;
            }
        }

    let topArtist = null;
    if (top["result"]["artists"].length > 0)
        topArtist = (<Grid item key={top["result"]["artists"][0].id}>
            <ArtistCard
                key={top["result"]["artists"][0].id}
                name={top["result"]["artists"][0].name}
                image={top["result"]["artists"][0].image}
                bestSong={bestSongForArtist}
            />
        </Grid>);
    let topTrack = null;
    if (top["result"]["tracks"].length > 0)
        topTrack = (<Grid item key={top["result"]["tracks"][0].id}>
            <SongCard
                key={top["result"]["tracks"][0].id}
                name={top["result"]["tracks"][0].name}
                artist={top["result"]["tracks"][0].artist}
                image={top["result"]["tracks"][0].image}
                duration={
                    msToText(top["result"]["tracks"][0].duration)
                }
            />
        </Grid>)

    let commonTopArtistTrackText = null;
    if (topArtist === null && topTrack === null)
        commonTopArtistTrackText = (<Typography component="h5" variant="h5" align="center">
            Could not find any top tracks or artists that you both like
        </Typography>)
    else if (topArtist === null)
        commonTopArtistTrackText = (<Typography component="h5" variant="h5" align="center">
            You both like this track
        </Typography>)
    else if (topTrack === null)
        commonTopArtistTrackText = (<Typography component="h5" variant="h5" align="center">
            You both like this artist
        </Typography>)
    else
        commonTopArtistTrackText = (<Typography component="h5" variant="h5" align="center">
            You both like this artist and track
        </Typography>)
    return (
        <div>
            <Container maxWidth="md" disableGutters={true} fixed={true}>
                <Grid container alignItems="center">
                    <Avatars
                        initiator={top["initiator"]}
                        target={top["target"]}
                    />
                </Grid>
                <Grid>
                    <br />
                    <Typography variant="h4" color="textPrimary" align="center">
                        You and {top.target.name} are <b>{top.result.percent}%</b> compatible!
                </Typography>
                    <Typography variant="subtitle1" color="textSecondary" align="center">
                        Here are the top common artists, tracks, and genres that you both share
                </Typography>
                </Grid>
                <Grid className={classes.spacer}>

                </Grid>
            </Container>
            <Container maxWidth="xs" disableGutters={true} fixed={true}>
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
                        <ListItems
                            items={top["result"]["tracks"]}
                            name={"Common Top Tracks"}
                        />
                    </Grid>
                    <Grid item key="lista-artists" md={4} className={classes.fullWidth}>
                        <ListItems
                            items={top["result"]["artists"]}
                            name={"Common Top Artists"}
                        />
                    </Grid>
                    <Grid item key="lista-genres" md={4} className={classes.fullWidth}>
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

function copyToClipboard() {
    var copyText = document.getElementById("link-to-be-copied") as HTMLInputElement;

    if (copyText === null)
        return;
    copyText.select();
    copyText.setSelectionRange(0, 99999);

    document.execCommand("copy");
}

function getLink(code: string) {
    return window.location.protocol + "//" + window.location.host + "/compare/" + code;
}

const useStylesNoUsername = makeStyles((theme) => ({
    root: {
        width: '100%',
        position: 'relative',
        overflow: 'auto',
        maxHeight: 400,
        backgroundColor: theme.palette.background.paper,
    },
    spacer: {
        height: 100
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    grid: {
        width: '100%',
        marginTop: '10px'
    },
    selected: {
        color: theme.palette.info.light,
    },
}));

function NoUsername(props: {
    Word: string,
    setWord: React.Dispatch<React.SetStateAction<string>>
}) {
    const classes = useStylesNoUsername();
    const [RedirectURL, setRedirectURL] = React.useState("");
    const { data, status } = useQuery('compare', () =>
        axios.get<NoUsernameCompareInterface>('/api/compare', {
            withCredentials: true
        }))
    if (RedirectURL !== "") {
        let url = "/compare/" + String(RedirectURL);
        if (String(RedirectURL).includes("/compare/"))
            url = "/compare/" + String(RedirectURL).split("/compare/")[1];
        return <Redirect to={url} />
    }

    if (status === "loading")
        return <Loading />
    if (status === "error")
        return null;
    if (data === undefined)
        return <Loading />;
    let compare = data?.data;
    let friends = [];

    for (var val in compare.friends) {
        friends.push(
            <ListItem key={"friend-" + compare.friends[val].username} component={Link} to={"/compare/" + compare.friends[val].code} classes={{
                root: classes.selected,
            }}>
                <Avatar name={compare.friends[val].name} image={compare.friends[val].image} />
                <ListItemText
                    primary={compare.friends[val].name}
                    secondary={compare.friends[val].code}
                />
            </ListItem>
        );
    }

    const changeWord = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        props.setWord(event.target.value);
    }

    const mySubmitHandler = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        if (props.Word !== "")
            setRedirectURL(props.Word);
    }

    return (
        <div>
            <Container maxWidth="md" disableGutters={true} fixed={true}>
                <Typography variant="h4" color="textPrimary" align="center">
                    Your code is <b>{compare.code}</b>
                </Typography>
                <Typography variant="h5" color="textSecondary" align="center">
                    Send it to your friends and compare your music taste to theirs!
                </Typography>
                <br />
                <br />
                <TextField
                    InputProps={{
                        readOnly: true,
                    }}
                    onClick={() => { copyToClipboard(); }}
                    id="link-to-be-copied"
                    fullWidth
                    label="Click to copy"
                    value={getLink(compare.code)}
                    variant="outlined"
                />

            </Container>
            <Container maxWidth="xs">
                <form
                    className={classes.form}
                    noValidate
                    onSubmit={mySubmitHandler}
                >
                    <TextField
                        id="standard-basic"
                        label="Enter an user code to compare to it"
                        variant="outlined"
                        className={classes.grid}
                        defaultValue={props.Word}
                        onChange={changeWord}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        type="submit"
                    >
                        Search
            </Button>
                </form>
            </Container>
            <Container className={classes.spacer}>
                <br />
            </Container>
            <Container maxWidth="xs" disableGutters={true} fixed={true}>
                <List className={classes.root} subheader={<li />} disablePadding={true}>
                    <ListSubheader color="default">Your friends</ListSubheader>
                    <ul>
                        {friends}
                    </ul>
                </List>
            </Container>
        </div>
    );
}