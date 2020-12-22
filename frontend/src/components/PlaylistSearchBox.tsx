import React from 'react';
import { Button, CssBaseline, Typography, makeStyles, Container, Select, MenuItem, Grid } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    fullWidth: {
        width: '100%'
    },
    grid: {
        width: '100%',
        marginTop: '10px'
    }
}));

export default function SearchBox(props: {
    playlists: any,
    setResults: React.Dispatch<React.SetStateAction<never[]>>
}) {
    const classes = useStyles();
    const playlists = props.playlists;

    let noplaylistfound = <MenuItem value="none" disabled>
        No playlist found!
            </MenuItem>;
    let list: any[] = [];
    if (playlists !== undefined) {
        list = [];
        for (var key in playlists) {
            list.push(
                <MenuItem
                    value={playlists[key].id}
                    key={playlists[key].id + "-" + key}
                    className={classes.fullWidth} >
                    {playlists[key].name}
                </MenuItem>
            );
        };
    }
    let shown = playlists !== undefined ? list : noplaylistfound;
    const [selectedPlaylist, setselectedPlaylist] = React.useState('none');
    const [Updating, setUpdating] = React.useState(false);
    const [ButtonText, setButtonText] = React.useState("");

    let button = (
        <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            type="submit"
        >
            Search
        </Button>);
    if (Updating === true)
        button = (
            <Button
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                type="submit"
                disabled={true}
            >
                {ButtonText}
            </Button>);

    const changePlaylist = (event: any) => {
        setselectedPlaylist(event.target.value);
    };

    const update = function () {
        setButtonText("Searching...");
        fetch('/api/playlist/' + selectedPlaylist, { cache: "no-store" }).then(res => res.json()).then(data => {
            setUpdating(!data.finished);
            props.setResults(data.Results);
            setUpdating(false);
        });
    }

    const mySubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (selectedPlaylist === 'none')
            return;
        setButtonText("Searching...");
        setUpdating(true);
        props.setResults([]);
        update();
    }

    return (
        <Container>
            <CssBaseline />
            <div className={classes.paper}>
                <Grid container spacing={2}>
                    <form
                        className={classes.form}
                        noValidate
                        onSubmit={mySubmitHandler}
                    >
                        <Typography variant="body2" color="textPrimary" align="center">
                            Here are all of your playlists:
                </Typography>
                        <Select
                            onChange={changePlaylist}
                            value={selectedPlaylist}
                            displayEmpty
                            autoWidth={true}
                            className={classes.grid}
                            variant="outlined"
                        >
                            <MenuItem value="none" disabled>
                                Select a playlist to search into
                            </MenuItem>
                            {shown}
                        </Select>
                        {button}
                    </form>
                </Grid>
            </div>
        </Container>
    )
}

