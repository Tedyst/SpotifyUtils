import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { TextField, Grid } from '@material-ui/core';
import { Redirect } from 'react-router-dom';

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
    const [URI, setURI] = React.useState("");
    const [Refresh, setRefresh] = React.useState("");

    const changeWord = (event) => {
        setURI(event.target.value);
    }

    const mySubmitHandler = (event) => {
        event.preventDefault();
        if (URI !== "") {
            let newURL = "/track/" + URI
            setRefresh(newURL);
        }
    }
    if (Refresh)
        return (<Redirect to={Refresh} />)

    return (
        <div className={classes.paper}>
            <CssBaseline />
            <Container disableGutters={true} fixed={true}>
                <Typography variant="h5" color="textPrimary" align="center">
                    To get an URI for a track, right click on that track and then select Share {">"} Copy Spotify URI
                </Typography>
            </Container>
            <Container maxWidth="xs">

                <Grid container spacing={2}>
                    <form
                        className={classes.form}
                        noValidate
                        onSubmit={mySubmitHandler}
                    >

                        <TextField
                            id="standard-basic"
                            label="Enter a track URI to search it"
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
                </Grid>
            </Container>
        </div>
    )
}
