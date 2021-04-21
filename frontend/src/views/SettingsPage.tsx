import React from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { Container } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import SettingsPage, { SettingsInterface } from '../components/Settings/SettingsPage';
import Loading from '../components/Loading';

export default function SettingsController() {
    const { data, status, error } = useQuery('settings', () => axios.get<SettingsInterface>('/api/settings', {
        withCredentials: true,
    }));

    let errorComponent = null;
    if (status === 'error' || data?.data.Success === false) {
        if (typeof error === 'object' && error != null) {
            if (error.toString() !== '') {
                errorComponent = (
                    <Container maxWidth="xs">
                        <Alert severity="error">{error.toString()}</Alert>
                    </Container>
                );
            }
        } else {
            errorComponent = (
                <Container maxWidth="xs">
                    <Alert severity="error">Could not extract data from server</Alert>
                </Container>
            );
        }
        return (
            <div>
                {errorComponent}
                <Loading />
            </div>
        );
    }
    if (data === undefined || status === 'loading') return <Loading />;
    const top = data?.data;

    if (top === undefined) {
        return <Loading />;
    }
    if (top.Success === false) {
        return <Loading />;
    }

    return (
        <SettingsPage
            data={data.data}
        />
    );
}
