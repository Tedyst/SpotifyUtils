import React from 'react';
import { CssBaseline, makeStyles, Container, CircularProgress } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    }
}));

export default function Loading() {
    const classes = useStyles();
    return (
        <Container maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <CircularProgress color="secondary" />
            </div>
        </Container>
    )
}