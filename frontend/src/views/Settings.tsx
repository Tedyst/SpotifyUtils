import React from 'react';
import {
    Button, Container, Card, Typography, makeStyles, CardContent, Checkbox, FormControlLabel,
} from '@material-ui/core';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import Loading from '../components/Loading';

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    pos: {
        marginBottom: 12,
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        width: '100%',
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    a: {
        color: 'inherit',
    },
}));

export interface SettingsInterface {
    Success: boolean;
    Settings: Settings;
}

export interface Settings {
    RecentTracks: boolean;
}

function Recent(props: { originalSettings: Settings, CSRFToken: string }) {
    const classes = useStyles();
    const queryClient = useQueryClient();
    const { originalSettings } = props;
    const [settings, setSettings] = React.useState(originalSettings);

    const handleChangeRecentTracks = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSettings({
            ...settings,
            RecentTracks: Boolean((event.target as HTMLInputElement).checked),
        });
    };

    const mutation = useMutation((set: Settings) => axios.post<Settings>('/api/settings', JSON.stringify(set), {
        withCredentials: true,
        headers: {
            'X-CSRF-Token': props.CSRFToken,
        },
    }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('settings');
            },
        });

    const onSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        mutation.mutate(settings);
    };

    return (
        <div>
            <Typography color="textPrimary" gutterBottom variant="h5" align="center">
                Here you can adjust your user settings
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" align="center">
                If you want to see what the app is doing in the background, you can check the
                {' '}
                <a href="https://github.com/Tedyst/SpotifyUtils" className={classes.a}>GitHub page</a>
            </Typography>
            <Container maxWidth="xs">
                <Card className={classes.root}>
                    <CardContent>
                        <form onSubmit={onSubmit} className={classes.form}>
                            <FormControlLabel
                                control={(
                                    <Checkbox
                                        checked={settings.RecentTracks}
                                        onChange={handleChangeRecentTracks}
                                        name="checkedB"
                                        color="primary"
                                    />
                                )}
                                label="Enable Recent Tracks Tracking"
                            />
                            <br />
                            <Button type="submit" variant="contained" color="primary" className={classes.submit}>
                                Submit
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </Container>
        </div>
    );
}

export default function RecentWrapper() {
    const { data, status } = useQuery('settings', () => axios.get<SettingsInterface>('/api/settings', {
        withCredentials: true,
    }));
    if (status === 'loading' || status === 'error' || data === undefined || data.data.Success === false) {
        return <Loading />;
    }
    return <Recent originalSettings={data.data.Settings} CSRFToken={data.headers['x-csrf-token']} />;
}
