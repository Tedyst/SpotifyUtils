import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Select, MenuItem, TextField, Grid } from '@material-ui/core';
import {
  selectPlaylists
} from '../store/user';
import { useSelector, useDispatch } from 'react-redux';
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
                <Grid item xs={6}>
                    <PlaylistCardDesktop />
                    <PlaylistCardDesktop />
                </Grid>
                <Grid item xs={3}>
                    <PlaylistCardMobile />
                </Grid>
                <Grid item xs={3}>
                    <PlaylistCardMobile />
                </Grid>
            </Grid>
        </Container>
        </div>
    )
}