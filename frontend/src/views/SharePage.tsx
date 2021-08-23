import { Container } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    Redirect,
} from 'react-router-dom';
import Top from './TopPage';

export default function Share() {
    const parsedUrl = new URLSearchParams(window.location.search).get('text');
    const { t } = useTranslation();
    const wrongComp = (
        <>
            <Container maxWidth="xs">
                <Alert severity="error">
                    <AlertTitle>{t('COMMON.INVALID_SHARE_LINK')}</AlertTitle>
                </Alert>
            </Container>
            <br />
            <Top />
        </>
    );
    if (parsedUrl === null) {
        return wrongComp;
    }
    try {
        const url = new URL(parsedUrl);
        if (url.hostname !== 'open.spotify.com') {
            return wrongComp;
        }
        const path = url.pathname.replace('/track/', '');
        return (
            <Redirect to={`/track/${path}`} />
        );
    } catch (_) {
        return wrongComp;
    }
}
