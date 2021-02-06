import React from 'react';
import {
    makeStyles,
    Container,
    Typography,
    TextField,
    List,
    ListItem,
    ListItemText,
    ListSubheader,
    Button
} from '@material-ui/core';
import {
    Link
} from 'react-router-dom';
import Avatar from '../Avatar';
import {
    Redirect
} from "react-router-dom";
import axios from 'axios';
import {
    useQuery
} from 'react-query';
import Loading from '../Loading';


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

function copyToClipboard() {
    var copyText = document.getElementById("link-to-be-copied") as HTMLInputElement;

    if (copyText === null) {
        return;
    }
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

export default function NoUsername(props: {
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
        if (String(RedirectURL).includes("/compare/")) {
            url = "/compare/" + String(RedirectURL).split("/compare/")[1];
        }
        return <Redirect to={url} />
    }

    if (status === "loading") {
        return <Loading />
    }
    if (status === "error") {
        return null;
    }
    if (data === undefined) {
        return <Loading />;
    }
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
        if (props.Word !== "") {
            setRedirectURL(props.Word);
        }
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