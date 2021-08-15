import React from 'react';
import {
    Container, Typography, makeStyles,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();
    const { settings } = props;

    if (settings === undefined) {
        return null;
    }

    return (
        <>
            <Typography align="center" color="textPrimary" gutterBottom variant="h5">
                {t('SETTINGS.TEXT_1')}
            </Typography>
            <Typography align="center" color="textSecondary" variant="subtitle1">
                {t('SETTINGS.TEXT_2')}
                {' '}
                <a className={classes.a} href="https://github.com/Tedyst/SpotifyUtils">
                    {t('SETTINGS.GITHUB_PAGE')}
                </a>
            </Typography>
            <Typography align="center" color="textSecondary" variant="subtitle2">
                {t('SETTINGS.TEXT_3')}
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
