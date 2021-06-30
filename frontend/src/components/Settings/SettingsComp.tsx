import React from 'react';
import {
    Button, Card, makeStyles, CardContent, Checkbox, FormControlLabel,
} from '@material-ui/core';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { Settings } from './SettingsPage';

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

export default function SettingsComp(props: {
    originalSettings: Settings,
    useReactQuery?: boolean,
    discordLink?: () => void | undefined,
}) {
    const classes = useStyles();
    const { originalSettings, useReactQuery, discordLink } = props;
    const [settings, setSettings] = React.useState(originalSettings);

    const handleChangeRecentTracks = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSettings({
            ...settings,
            RecentTracks: Boolean((event.target as HTMLInputElement).checked),
        });
    };

    const discordLinkButton = !discordLink ? null : (
        <Card className={classes.root}>
            <CardContent>
                <Button
                    onClick={discordLink}
                    // className={classes.submit}
                    variant="contained"
                    color="secondary"
                >
                    Click here to link the Discord account
                </Button>
            </CardContent>
        </Card>
    );

    let mutation: any;
    if (useReactQuery) {
        const queryClient = useQueryClient();
        mutation = useMutation((set: Settings) => axios.post<Settings>('/api/settings', JSON.stringify(set), {
            withCredentials: true,
        }),
            {
                onSuccess: () => {
                    queryClient.invalidateQueries('status');
                },
            });
    }

    const onSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        mutation?.mutate(settings);
    };

    return (
        <>
            <Card className={classes.root}>
                <CardContent>
                    <form className={classes.form} onSubmit={onSubmit}>
                        <FormControlLabel
                            control={(
                                <Checkbox
                                    checked={settings.RecentTracks}
                                    color="primary"
                                    name="checkedB"
                                    onChange={handleChangeRecentTracks}
                                />
                            )}
                            label="Enable Recent Tracks Tracking"
                        />
                        <br />
                        <Button className={classes.submit} color="primary" type="submit" variant="contained">
                            Save Settings
                        </Button>
                    </form>
                </CardContent>
            </Card>
            {discordLinkButton}
        </>
    );
}

SettingsComp.defaultProps = {
    useReactQuery: true,
    discordLink: undefined,
};
