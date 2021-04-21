import React from 'react';
import {
    Avatar, Button, CssBaseline, Typography, makeStyles, Container,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Alert, AlertTitle } from '@material-ui/lab';

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
}));

interface AuthURLInterface {
    success: boolean;
    URL: string;
}

export default function LoginPage(props: { loggingIn: boolean }) {
    const classes = useStyles();
    const { data, status, error } = useQuery('authURL', () => axios.get<AuthURLInterface>(`/api/auth-url?host=${window.location.protocol}//${window.location.host}`, {
        withCredentials: true,
    }));

    const { loggingIn } = props;
    let buttonText = loggingIn
        ? 'Logging in... Please wait...'
        : 'Sign in using Spotify';
    let errorComponent = null;
    if (status === 'error') {
        buttonText = 'Cannot contact server';
        if (typeof error === 'object' && error != null) {
            if (error.toString() !== '') {
                errorComponent = (
                    <Alert severity="error">
                        <AlertTitle>{error.toString()}</AlertTitle>
                    </Alert>
                );
            }
        }
    }
    return (
        <Container maxWidth="xs">
            <CssBaseline />
            {errorComponent}
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography variant="h5">
                    Sign in
                </Typography>
                <form className={classes.form} noValidate>
                    <Typography align="center" color="textPrimary" variant="body2">
                        To use the app you need to sign in using Spotify.
                    </Typography>
                    <Button
                        className={classes.submit}
                        color="primary"
                        disabled={
                            loggingIn || status === 'loading' || data === undefined || status === 'error'
                        }
                        fullWidth
                        href={data?.data.URL}
                        type="submit"
                        variant="contained"
                    >
                        {buttonText}
                    </Button>
                </form>
            </div>
        </Container>
    );
}
