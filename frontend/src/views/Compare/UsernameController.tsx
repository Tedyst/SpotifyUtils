import React from 'react';
import {
    useParams,
} from 'react-router-dom';
import axios from 'axios';
import { useQuery } from 'react-query';
import { Container } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import Loading from '../../components/Loading';
import UsernameComp from '../../components/Compare/UsernameComp';
import { UsernameInterface } from '../../components/Compare/CompareInterfaces';

interface ParamTypes {
    code: string
}

export default function Username() {
    const { code } = useParams<ParamTypes>();
    const sanitizedCode = code.replace(/[^a-zA-Z0-9]+/g, '').substring(0, 6);
    const { data, status, error } = useQuery(['compare', sanitizedCode], () => axios.get<UsernameInterface>(`/api/compare/${sanitizedCode}`, {
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
    if (data === undefined || status === 'loading' || data?.data === undefined) return <Loading />;

    return <UsernameComp data={data.data} />;
}
