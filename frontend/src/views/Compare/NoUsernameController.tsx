import React from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { Container } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

import Loading from '../../components/Loading';
import NoUsernameComp from '../../components/Compare/NoUsernameComp';
import { NoUsernameCompareInterface } from '../../components/Compare/CompareInterfaces';

export default function NoUsername() {
    const { data, status, error } = useQuery('compare', () => axios.get<NoUsernameCompareInterface>('/api/compare', {
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
    if (data === undefined || status === 'loading' || data?.data === undefined) return <Loading />;

    return <NoUsernameComp compare={data.data} />;
}
