import React from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { Container } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Loading from '../components/Loading';
import RecentComp, { RecentInterface } from '../components/Recent/RecentComp';

const refetchIntervalSeconds = 30;

export default function RecentPage() {
    const { data, status, error } = useQuery('recent', () => axios.get<RecentInterface>('/api/recent', {
        withCredentials: true,
    }), {
        refetchInterval: refetchIntervalSeconds * 1000,
        refetchOnWindowFocus: true,
        staleTime: refetchIntervalSeconds * 1000,
    });

    let errorComponent = null;
    if (status === 'error' || data?.data.Success === false) {
        const errorMessage = data?.data.Error ? data.data.Error : null;
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
    if (data === undefined || status === 'loading' || data?.data === undefined) return <Loading />;

    return <RecentComp results={data.data.Results} />;
}
