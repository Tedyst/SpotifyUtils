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
    data: UsernameInterface | undefined,
}) {
    const { data } = props;
    const classes = useStyles();
    if (data === undefined) {
        return null;
    }

    let bestSongForArtist: string | undefined;
    if (data.Result.Artists && data.Result.Tracks) {
        if (data.Result.Artists.length > 0) {
            Object.values(data.Result.Tracks).forEach((value) => {
                if (bestSongForArtist === undefined && data.Result.Artists) {
                    if (value.Artist === data.Result.Artists[0].Name) {
                        bestSongForArtist = value.Name;
                    }
                }
            });
        }
    }

    let dataArtist = null;
    if (data.Result.Artists && data.Result.Artists.length > 0) {
        dataArtist = (
            <Grid item key={data.Result.Artists[0].ID}>
                <ArtistCard
                    bestSong={bestSongForArtist}
                    image={data.Result.Artists[0].Image}
                    key={data.Result.Artists[0].ID}
                    name={data.Result.Artists[0].Name}
                />
            </Grid>
        );
    }
    let dataTrack = null;
    if (data.Result.Tracks && data.Result.Tracks.length > 0) {
        dataTrack = (
            <Grid item key={data.Result.Tracks[0].ID}>
                <SongCard
                    artist={data.Result.Tracks[0].Artist}
                    duration={data.Result.Tracks[0].Duration}
                    image={data.Result.Tracks[0].Image}
                    key={data.Result.Tracks[0].ID}
                    name={data.Result.Tracks[0].Name}
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
        <>
            <Container disableGutters fixed maxWidth="md">
                <Grid alignItems="center" container>
                    <Avatars
                        Initiator={data.Initiator}
                        Target={data.Target}
                    />
                </Grid>
                <Grid>
                    <br />
                    <Typography align="center" color="textPrimary" variant="h4">
                        You and
                        {' '}
                        {data.Target.Name}
                        {' '}
                        are
                        {' '}
                        <b>
                            {data.Result.Score}
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
                            items={data.Result.Tracks}
                            name="Common data Tracks"
                        />
                    </Grid>
                    <Grid className={classes.fullWidth} item key="lista-artists" md={4}>
                        <ListItems
                            items={data.Result.Artists}
                            name="Common data Artists"
                        />
                    </Grid>
                    <Grid className={classes.fullWidth} item key="lista-genres" md={4}>
                        <ListItems
                            items={data.Result.Genres}
                            name="Common data Genres"
                        />
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}
