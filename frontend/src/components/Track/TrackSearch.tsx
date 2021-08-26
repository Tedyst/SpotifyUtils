import React from 'react';
import {
    Button, Typography, makeStyles, Container, TextField, Grid,
} from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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

export default function TrackSearch() {
    const classes = useStyles();
    const { t } = useTranslation();
    const [URI, setURI] = React.useState('');
    const [Refresh, setRefresh] = React.useState('');

    const changeWord = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setURI(event.target.value);
    };

    const mySubmitHandler = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        if (URI !== '') {
            let realURI = URI;
            if (URI.startsWith('https://open.spotify.com/')) {
                const split = URI.split('/');
                if (split.length === 5) {
                    // eslint-disable-next-line prefer-destructuring
                    [realURI] = split[4].split('?');
                }
            }
            const newURL = `/track/${realURI}`;
            setRefresh(newURL);
        }
    };
    if (Refresh) return (<Redirect to={Refresh} />);

    return (
        <div className={classes.paper}>
            <Container disableGutters fixed>
                <Typography variant="h5" color="textPrimary" align="center">
                    {t('TRACK_SEARCH.TEXT_1')}
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
                            label={t('TRACK_SEARCH.ENTER_URI')}
                            variant="outlined"
                            className={classes.grid}
                            onChange={changeWord}
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            type="submit"
                        >
                            {t('COMMON.SEARCH')}
                        </Button>
                    </form>
                </Grid>
            </Container>
        </div>
    );
}
