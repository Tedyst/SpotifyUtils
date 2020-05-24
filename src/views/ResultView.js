import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { Grid } from '@material-ui/core';
import PlaylistView from '../components/PlaylistSearch';
import PlaylistCardDesktop from '../components/PlaylistCardDesktop'
import PlaylistCardMobile from '../components/PlaylistCardMobile'

export default function ResultView() {
    return (
        <div>
        <Container maxWidth="xs">
            <PlaylistView />
            <CssBaseline />
        </Container>
        <Container maxWidth="lg">
            <Grid container spacing={2}>
                <Grid item xs={4} md={3} sm={6} lg={2}>
                    <PlaylistCardMobile />
                </Grid>
            </Grid>
        </Container>
        </div>
    )
}