import React from 'react';
import {
    Redirect,
} from 'react-router-dom';

export default function RedirectToSaved() {
    const lastURL = window.localStorage.getItem('lastURL');
    if (lastURL !== '' && lastURL) {
        window.localStorage.removeItem('lastURL');
        return <Redirect to={`${lastURL}`} />;
    }
    return null;
}
