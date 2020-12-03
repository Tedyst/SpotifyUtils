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
            <Test
                Word={Word}
                setWord={setWord}
            />
        </Route>
    </Switch>);
}


function Username(props) {
    const classes = useStyles();
    const [Updating, setUpdating] = useState(null);
    let { code } = useParams();
    const [top, setTop] = useState(null);
    if (top === null && Updating === null) {
        setUpdating(code);
        fetch('/api/compare/' + code).then(res => res.json()).then(data => {
            setTop(data);
            if (data.success)
                setUpdating(code);
            else
                setUpdating(null);
        });
        return <Test
            Word={props.Word}
            setWord={props.setWord}
        />
    } else if (top === null && Updating !== null) {
        return <Test
            Word={props.Word}
            setWord={props.setWord}
        />
    } else if (top === null) {
        return <Redirect to="/compare" />;
    }
    if (top["success"] === false) {
        return (
            <Test
                Word={props.Word}
                setWord={props.setWord}
            />
        )
    }
    let bestSongForArtist = null;
    if (top["result"]["artists"].length > 0)
        for (var val in top["result"]["tracks"]) {
            if (top["result"]["tracks"][val].artist === top["result"]["artists"][0].name && bestSongForArtist === null) {
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
    var copyText = document.getElementById("link-to-be-copied");

    copyText.select();
    copyText.setSelectionRange(0, 99999);

    document.execCommand("copy");
}

function getLink(code) {
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
    }
}));

function Test(props) {
    const compare = useSelector(selectCompare);
    const classes = useStylesNoUsername();
    const [RedirectURL, setRedirectURL] = React.useState(null);
    if (RedirectURL !== null) {
        let url = "/compare/" + String(RedirectURL);
        if (String(RedirectURL).includes("/compare/"))
            url = "/compare/" + String(RedirectURL).split("/compare/")[1];
        return <Redirect to={url} />
    }

    let friends = [];
    for (var val in compare.friends) {
        friends.push(
            <ListItem key={"friend-" + compare.friends[val].username} component={Link} to={"/compare/" + compare.friends[val].code}>
                <Avatar name={compare.friends[val].name} image={compare.friends[val].image}>
                </Avatar>
                <ListItemText
                    primary={compare.friends[val].name}
                    secondary={compare.friends[val].code}
                />
            </ListItem>
        );
    }

    const changeWord = (event) => {
        props.setWord(event.target.value);
    }

    const mySubmitHandler = (event) => {
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
                    <ListSubheader color="primary">Your friends</ListSubheader>
                    <ul>
                        {friends}
                    </ul>
                </List>
            </Container>
        </div>
    );
}