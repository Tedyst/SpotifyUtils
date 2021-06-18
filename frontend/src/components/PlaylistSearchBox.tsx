import React from 'react';
import {
    Button, Typography, makeStyles, Container, Select, MenuItem, Grid,
} from '@material-ui/core';
import { Playlist } from '../App';

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
        width: '100%',
    },
    grid: {
        width: '100%',
        marginTop: '10px',
    },
}));

export default function SearchBox(props: {
    playlists: Playlist[] | undefined,
    setPlaylist: (s: string) => void,
    searching?: boolean,
}) {
    const classes = useStyles();
    const { playlists, setPlaylist, searching } = props;
    const [selectedPlaylist, setSelectedPlaylist] = React.useState<string>('none');
    const ButtonText = searching ? 'Searching...' : 'Search';

    // TODO: What is this file
    let list: any[] = [];
    if (playlists !== undefined) {
        list = [];
        Object.values(playlists).forEach((i) => {
            list.push(
                <MenuItem
                    className={classes.fullWidth}
                    key={`${i.ID}-playlist`}
                    value={i.ID}
                >
                    {i.Name}
                </MenuItem>,
            );
        });
    } else {
        list.push(
            <MenuItem disabled value="none">
                No playlist found!
            </MenuItem>,
        );
    }

    const changePlaylist = (event: any) => {
        setSelectedPlaylist(event.target.value);
    };

    const mySubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (selectedPlaylist === 'none') return;
        setPlaylist(selectedPlaylist);
    };

    return (
        <Container>
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
                            autoWidth
                            className={classes.grid}
                            variant="outlined"
                        >
                            <MenuItem value="none" disabled>
                                Select a playlist to search into
                            </MenuItem>
                            {list}
                        </Select>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            type="submit"
                            disabled={searching}
                        >
                            {ButtonText}
                        </Button>
                    </form>
                </Grid>
            </div>
        </Container>
    );
}

SearchBox.defaultProps = {
    searching: false,
};
