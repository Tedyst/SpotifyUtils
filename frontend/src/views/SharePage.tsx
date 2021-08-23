import React from 'react';
import {
    Redirect,
} from 'react-router-dom';

export default function Share() {
    const parsedUrl = new URLSearchParams(window.location.search).get('text');
    if (parsedUrl === null) {
        return <Redirect to="/" />;
    }
    try {
        const url = new URL(parsedUrl);
        if (url.hostname !== 'open.spotify.com') {
            return <Redirect to="/" />;
        }
        const path = url.pathname.replace('/track/', '');
        return (
            <Redirect to={`/track/${path}`} />
        );
    } catch (_) {
        return <Redirect to="/" />;
    }
}
