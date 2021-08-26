import React from 'react';
import {
    Button, Card, makeStyles, CardContent, Checkbox, FormControlLabel, Select, MenuItem,
} from '@material-ui/core';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Settings } from './SettingsPage';
import i18n from '../../i18n';

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
}) {
    const classes = useStyles();
    const { t } = useTranslation();
    const { originalSettings, useReactQuery } = props;
    const [settings, setSettings] = React.useState(
        { ...originalSettings, Language: i18n.languages[0] ? i18n.languages[0] : 'en' },
    );

    const handleChangeRecentTracks = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSettings({
            ...settings,
            RecentTracks: Boolean((event.target as HTMLInputElement).checked),
        });
    };

    const handleChangeLanguage = (event: React.ChangeEvent<any>) => {
        setSettings({
            ...settings,
            Language: (event.target as HTMLInputElement).value,
        });
    };

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
        i18n.changeLanguage(settings.Language);
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
                        label={t('SETTINGS.ENABLE_RECENT_TRACKING')}
                    />
                    <br />
                    <Select
                        onChange={handleChangeLanguage}
                        value={settings.Language}
                        displayEmpty
                        autoWidth
                        variant="outlined"
                        className={classes.form}
                    >
                        <MenuItem value="en">
                            English
                        </MenuItem>
                        <MenuItem value="ro">
                            Romana
                        </MenuItem>
                    </Select>
                    <br />
                    <Button className={classes.submit} color="primary" type="submit" variant="contained">
                        {t('SETTINGS.SAVE_SETTINGS')}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

SettingsComp.defaultProps = {
    useReactQuery: true,
};
