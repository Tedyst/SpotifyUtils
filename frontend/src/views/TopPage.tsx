import React from 'react';
import {
    Container,
} from '@material-ui/core';
import { useQuery } from 'react-query';
import axios from 'axios';
import Alert from '@material-ui/lab/Alert';
import TopComp, { TopInterface } from '../components/Top/TopComp';
import Loading from '../components/Loading';

export default function Top() {
    const { data, status, error } = useQuery('top', () => axios.get<TopInterface>('/api/top', {
        withCredentials: true,
    }));

    let errorComponent = null;
    if (status === 'error' || data?.data.success === false) {
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
    if (top.success === false) {
        return <Loading />;
    }

    return <TopComp top={top} />;
}
