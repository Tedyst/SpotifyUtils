import React from 'react';
import {
    Container,
} from '@material-ui/core';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Alert, AlertTitle } from '@material-ui/lab';
import TopComp, { TopInterface } from '../components/Top/TopComp';
import Loading from '../components/Loading';

export default function Top() {
    const { data, status, error } = useQuery('top', () => axios.get<TopInterface>('/api/top', {
        withCredentials: true,
    }));

    let errorComponent = null;
    if (status === 'error' || data?.data.Success === false) {
        const errorMessage = data?.data.Error ? data.data.Error : null;
        if (typeof error === 'object' && error != null) {
            if (error.toString() !== '') {
                errorComponent = (
                    <Container maxWidth="xs">
                        <Alert severity="error">
                            <AlertTitle>{error.toString()}</AlertTitle>
                            {errorMessage}
                        </Alert>
                    </Container>
                );
            }
        } else {
            errorComponent = (
                <Container maxWidth="xs">
                    <Alert severity="error">
                        <AlertTitle>Could not extract data from server</AlertTitle>
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
    const top = data?.data;

    if (top === undefined) {
        return <Loading />;
    }
    if (top.Success === false) {
        return <Loading />;
    }

    return <TopComp top={top} />;
}
