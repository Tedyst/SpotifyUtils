import React from 'react';
import {
    Container, Typography, makeStyles,
} from '@material-ui/core';
import SettingsComp from './SettingsComp';

export interface SettingsInterface {
    Success: boolean;
    Settings: Settings;
}

export interface Settings {
    RecentTracks: boolean;
}

const useStyles = makeStyles(() => ({
    a: {
        color: 'inherit',
    },
}));

export default function SettingsPage(props: {
    mutation?: any | undefined,
    data: SettingsInterface,
}) {
    const classes = useStyles();
    const { mutation, data } = props;

    return (
        <div>
            <Typography align="center" color="textPrimary" gutterBottom variant="h5">
                Here you can adjust your user settings
            </Typography>
            <Typography align="center" color="textSecondary" variant="subtitle1">
                If you want to see what the app is doing in the background, you can check the
                {' '}
                <a className={classes.a} href="https://github.com/Tedyst/SpotifyUtils">
                    GitHub page
                </a>
            </Typography>
            <Container maxWidth="xs">
                <SettingsComp
                    mutation={mutation}
                    originalSettings={data.Settings}
                />
            </Container>
        </div>
    );
}

SettingsPage.defaultProps = {
    mutation: undefined,
};
