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
    if (status === 'error') {
        // This is needed to get the response data for a 401 request
        const myCustomErrorLet: any = {};
        myCustomErrorLet.data = error;

        let errorMessage: string = '';
        if (myCustomErrorLet?.data?.response?.data?.Error) {
            errorMessage = myCustomErrorLet.data.response.data.Error;
        } else if (data?.data?.Error) {
            errorMessage = data.data.Error;
        }

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

    if (!top.Success) {
        return (
            <Container maxWidth="xs">
                <Alert severity="error">
                    <AlertTitle>Error when extracting data from server</AlertTitle>
                    Server did not reply with data
                </Alert>
            </Container>
        );
    }

    if (!top || !top.Result || !top.Result.Tracks || !top.Result.Artists || !top.Result.Genres) {
        return (
            <Container maxWidth="xs">
                <Alert severity="error">
                    <AlertTitle>Error when extracting data from server</AlertTitle>
                    Result is invalid
                </Alert>
            </Container>
        );
    }

    return <TopComp top={top} />;
}
