import React from 'react';
import {
    makeStyles,
    Container,
    Grid,
    Typography,
} from '@material-ui/core';
import { UsernameInterface } from './CompareInterfaces';
import ArtistCard from '../ArtistCard';
import SongCard from '../SongCardRight';
import Avatars from '../Avatars';
import ListItems from '../ItemList';

const useStyles = makeStyles(() => ({
    root: {
        flexGrow: 1,
    },
    fullWidth: {
        width: '100%',
    },
    spacer: {
        height: 100,
    },
}));

export default function UsernameComp(props: {
    data: UsernameInterface,
}) {
    const { data } = props;
    const classes = useStyles();
    let bestSongForArtist: string | undefined;
    if (data.result.artists !== null && data.result.tracks !== null) {
        if (data.result.artists.length > 0) {
            Object.values(data.result.tracks).forEach((value) => {
                if (bestSongForArtist === undefined && data.result.artists !== null) {
                    if (value.artist === data.result.artists[0].name) {
                        bestSongForArtist = value.name;
                    }
                }
            });
        }
    }

    let dataArtist = null;
    if (data.result.artists !== null && data.result.artists.length > 0) {
        dataArtist = (
            <Grid item key={data.result.artists[0].id}>
                <ArtistCard
                    bestSong={bestSongForArtist}
                    image={data.result.artists[0].image}
                    key={data.result.artists[0].id}
                    name={data.result.artists[0].name}
                />
            </Grid>
        );
    }
    let dataTrack = null;
    if (data.result.tracks !== null && data.result.tracks.length > 0) {
        dataTrack = (
            <Grid item key={data.result.tracks[0].id}>
                <SongCard
                    artist={data.result.tracks[0].artist}
                    duration={data.result.tracks[0].duration}
                    image={data.result.tracks[0].image}
                    key={data.result.tracks[0].id}
                    name={data.result.tracks[0].name}
                />
            </Grid>
        );
    }

    let commondataArtistTrackText = null;
    if (dataArtist === null && dataTrack === null) {
        commondataArtistTrackText = (
            <Typography align="center" component="h5" variant="h5">
                Could not find any data tracks or artists that you both like
            </Typography>
        );
    } else if (dataArtist === null) {
        commondataArtistTrackText = (
            <Typography align="center" component="h5" variant="h5">
                You both like this track
            </Typography>
        );
    } else if (dataTrack === null) {
        commondataArtistTrackText = (
            <Typography align="center" component="h5" variant="h5">
                You both like this artist
            </Typography>
        );
    } else {
        commondataArtistTrackText = (
            <Typography align="center" component="h5" variant="h5">
                You both like this artist and track
            </Typography>
        );
    }
    return (
        <div>
            <Container disableGutters fixed maxWidth="md">
                <Grid alignItems="center" container>
                    <Avatars
                        initiator={data.initiator}
                        target={data.target}
                    />
                </Grid>
                <Grid>
                    <br />
                    <Typography align="center" color="textPrimary" variant="h4">
                        You and
                        {' '}
                        {data.target.name}
                        {' '}
                        are
                        {' '}
                        <b>
                            {data.result.percent}
                            %
                        </b>
                        {' '}
                        compatible!
                    </Typography>
                    <Typography align="center" color="textSecondary" variant="subtitle1">
                        Here are the data common artists, tracks, and genres that you both share
                    </Typography>
                </Grid>
                <Grid className={classes.spacer} />
            </Container>
            <Container disableGutters fixed maxWidth="xs">
                <Grid>
                    {commondataArtistTrackText}
                    <br />
                </Grid>
                <Grid alignItems="stretch" className={classes.root} container direction="column" spacing={2}>
                    {dataArtist}
                </Grid>
                <Grid alignItems="stretch" className={classes.root} container direction="column" spacing={2}>
                    {dataTrack}
                </Grid>
            </Container>
            <br />
            <br />
            <Container maxWidth="xl">
                <Grid alignItems="stretch" className={classes.root} container direction="row" spacing={2}>
                    <Grid className={classes.fullWidth} item key="lista-tracks" md={4}>
                        <ListItems
                            items={data.result.tracks}
                            name="Common data Tracks"
                        />
                    </Grid>
                    <Grid className={classes.fullWidth} item key="lista-artists" md={4}>
                        <ListItems
                            items={data.result.artists}
                            name="Common data Artists"
                        />
                    </Grid>
                    <Grid className={classes.fullWidth} item key="lista-genres" md={4}>
                        <ListItems
                            items={data.result.genres}
                            name="Common data Genres"
                        />
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
}
