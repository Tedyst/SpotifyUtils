import React from 'react';
import {
    Button, Card, makeStyles, CardContent, Checkbox, FormControlLabel,
} from '@material-ui/core';
import { UseMutationResult, AxiosResponse } from 'axios';
import { Settings } from '../../views/Settings';

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
    mutation?: UseMutationResult<AxiosResponse<Settings>, unknown, Settings, unknown> | undefined
}) {
    const classes = useStyles();
    const { originalSettings, mutation } = props;
    const [settings, setSettings] = React.useState(originalSettings);

    const handleChangeRecentTracks = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSettings({
            ...settings,
            RecentTracks: Boolean((event.target as HTMLInputElement).checked),
        });
    };

    const onSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        mutation?.mutate(settings);
    };

    return (
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
                        Submit
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

SettingsComp.defaultProps = {
    mutation: undefined,
};
