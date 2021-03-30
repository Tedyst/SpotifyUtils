import React from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { Container } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Loading from '../components/Loading';
import RecentComp, { RecentInterface } from '../components/Recent/RecentComp';

const refetchIntervalSeconds = 60;

export default function RecentPage() {
    const { data, status, error } = useQuery('recent', () => axios.get<RecentInterface>('/api/recent', {
        withCredentials: true,
    }), {
        refetchInterval: refetchIntervalSeconds * 1000,
        refetchOnWindowFocus: true,
    });

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
    if (data === undefined || status === 'loading' || data?.data === undefined) return <Loading />;

    return <RecentComp results={data.data.Results} />;
}
