import React from 'react';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
    Container, Typography, makeStyles,
} from '@material-ui/core';
import SettingsComp from '../components/Settings/SettingsComp';
import Loading from '../components/Loading';

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

export default function SettingsLogic() {
    const queryClient = useQueryClient();
    const classes = useStyles();
    const { data, status } = useQuery('settings', () => axios.get<SettingsInterface>('/api/settings', {
        withCredentials: true,
    }));
    const CSRFToken = data?.headers['x-csrf-token'];
    if (status === 'loading' || status === 'error' || data === undefined || data.data.Success === false) {
        return <Loading />;
    }

    const mutation = useMutation((set: Settings) => axios.post<Settings>('/api/settings', JSON.stringify(set), {
        withCredentials: true,
        headers: {
            'X-CSRF-Token': CSRFToken,
        },
    }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('settings');
            },
        });

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
                    originalSettings={data.data.Settings}
                />
            </Container>
        </div>
    );
}
