import React from 'react';
import {
    Container, Typography, makeStyles,
} from '@material-ui/core';
import SettingsComp from './SettingsComp';

export interface Settings {
    RecentTracks: boolean;
}

const useStyles = makeStyles(() => ({
    a: {
        color: 'inherit',
    },
}));

export default function SettingsPage(props: {
    settings: Settings | undefined,
}) {
    const classes = useStyles();
    const { settings } = props;

    if (settings === undefined) {
        return null;
    }

    return (
        <>
            <Typography align="center" color="textPrimary" gutterBottom variant="h5">
                Here you can adjust your personal settings
            </Typography>
            <Typography align="center" color="textSecondary" variant="subtitle1">
                If you want to see what the app is doing in the background, you can check the
                {' '}
                <a className={classes.a} href="https://github.com/Tedyst/SpotifyUtils">
                    GitHub page
                </a>
            </Typography>
            <Typography align="center" color="textSecondary" variant="subtitle2">
                Disabling the Recent Tracks option will delete all the data
                that is related to this feature and associated with this account!
            </Typography>
            <Container maxWidth="xs">
                <SettingsComp
                    originalSettings={settings}
                    useReactQuery
                />
            </Container>
        </>
    );
}
