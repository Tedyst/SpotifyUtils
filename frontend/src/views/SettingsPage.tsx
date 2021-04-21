import React from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { Container } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import SettingsPage from '../components/Settings/SettingsPage';
import Loading from '../components/Loading';
import { StatusInterface } from '../App';

export default function SettingsController() {
    const { data, status, error } = useQuery('status', () => axios.get<StatusInterface>('/api/status', {
        withCredentials: true,
    }));

    let errorComponent = null;
    if (status === 'error' || data?.data.success === false) {
        const errorMessage = data?.data.error ? data.data.error : null;
        if (typeof error === 'object' && error != null) {
            if (error.toString() !== '') {
                errorComponent = (
                    <Container maxWidth="xs">
                        <Alert severity="error">
                            {error.toString()}
                            {'\n'}
                            {errorMessage}
                        </Alert>
                    </Container>
                );
            }
        } else {
            errorComponent = (
                <Container maxWidth="xs">
                    <Alert severity="error">
                        Could not extract data from server
                        {'\n'}
                        {errorMessage}
                    </Alert>
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

    return (
        <SettingsPage
            settings={data.data.settings}
        />
    );
}
