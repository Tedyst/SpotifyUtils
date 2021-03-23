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
    Button,
} from '@material-ui/core';
import {
    Link,
    Redirect,
} from 'react-router-dom';

import axios from 'axios';
import {
    useQuery,
} from 'react-query';
import Avatar from '../Avatar';
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
    previewURL: string;
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
    const copyText = document.getElementById('link-to-be-copied') as HTMLInputElement;

    if (copyText === null) {
        return;
    }
    copyText.select();
    copyText.setSelectionRange(0, 99999);

    document.execCommand('copy');
}

function getLink(code: string) {
    return `${window.location.protocol}//${window.location.host}/compare/${code}`;
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
        height: 100,
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
        marginTop: '10px',
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
    const [RedirectURL, setRedirectURL] = React.useState('');
    const { data, status } = useQuery('compare', () => axios.get<NoUsernameCompareInterface>('/api/compare', {
        withCredentials: true,
    }));
    const { Word } = props;
    if (RedirectURL !== '') {
        let url = `/compare/${String(RedirectURL)}`;
        if (String(RedirectURL).includes('/compare/')) {
            url = `/compare/${String(RedirectURL).split('/compare/')[1]}`;
        }
        return <Redirect to={url} />;
    }
    if (status === 'loading') {
        return <Loading />;
    }
    if (status === 'error') {
        return null;
    }
    if (data === undefined) {
        return <Loading />;
    }
    const compare = data?.data;
    const friends: any[] = [];
    Object.values(compare.friends).forEach((value) => {
        friends.push(
            <ListItem
                classes={{
                    root: classes.selected,
                }}
                component={Link}
                key={`friend-${value.username}`}
                to={`/compare/${value.code}`}
            >
                <Avatar image={value.image} name={value.name} />
                <ListItemText
                    primary={value.name}
                    secondary={value.code}
                />
            </ListItem>,
        );
    });

    const changeWord = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        props.setWord(event.target.value);
    };

    const mySubmitHandler = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        if (props.Word !== '') {
            setRedirectURL(props.Word);
        }
    };

    return (
        <div>
            <Container disableGutters fixed maxWidth="md">
                <Typography align="center" color="textPrimary" variant="h4">
                    Your code is
                    {' '}
                    <b>
                        {compare.code}
                    </b>
                </Typography>
                <Typography align="center" color="textSecondary" variant="h5">
                    Send it to your friends and compare your music taste to theirs!
                </Typography>
                <br />
                <br />
                <TextField
                    InputProps={{
                        readOnly: true,
                    }}
                    fullWidth
                    id="link-to-be-copied"
                    label="Click to copy"
                    onClick={() => { copyToClipboard(); }}
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
                        className={classes.grid}
                        defaultValue={Word}
                        id="standard-basic"
                        label="Enter an user code to compare to it"
                        onChange={changeWord}
                        variant="outlined"
                    />
                    <Button
                        className={classes.submit}
                        color="primary"
                        fullWidth
                        type="submit"
                        variant="contained"
                    >
                        Search
                    </Button>
                </form>
            </Container>
            <Container className={classes.spacer}>
                <br />
            </Container>
            <Container disableGutters fixed maxWidth="xs">
                <List className={classes.root} disablePadding subheader={<li />}>
                    <ListSubheader color="default">
                        Your friends
                    </ListSubheader>
                    <ul>
                        {friends}
                    </ul>
                </List>
            </Container>
        </div>
    );
}
