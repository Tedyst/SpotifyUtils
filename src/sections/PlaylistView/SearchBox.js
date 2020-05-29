import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Select, MenuItem, Grid } from '@material-ui/core';

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

export default function SearchBox(props) {
    const classes = useStyles();
    const playlists = props.playlists;

    let idk = <MenuItem value="none" disabled>
                No playlist found!
            </MenuItem>;
    if(playlists !== undefined){
        idk = [];
        for(var key in playlists) {
            idk.push(
            <MenuItem
                value={playlists[key].id}
                key={playlists[key].id}
                className={classes.fullWidth} >
                    {playlists[key].name}
            </MenuItem>
            );
        };
    }
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
    if(Updating === true)
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

    const changePlaylist = (event) => {
    setselectedPlaylist(event.target.value);
    };

    const update = function (){
        fetch('/api/lyrics/' + selectedPlaylist).then(res => res.json()).then(data => {
            setUpdating(!data.finished);
            props.setResults(data.results);
            if(data.total === -1)
                setButtonText("Searching...");
            else
                setButtonText("Searching..." + data.searched + "/" + data.total);
            if(!data.finished)
                setTimeout(()=>{
                    update();
                }, 500);
        });
    }

    const mySubmitHandler = (event) => {
        event.preventDefault();
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
                    {idk}
                </Select>
                {button}
                </form>
                </Grid>
            </div>
        </Container>
    )
}

