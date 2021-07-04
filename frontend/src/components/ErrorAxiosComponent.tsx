import React from 'react';
import { Container } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import { AxiosResponse } from 'axios';
import Loading from '../components/Loading';

export default function ErrorAxiosComponent(props: {
    data: AxiosResponse | undefined,
    status: 'idle' | 'error' | 'loading' | 'success',
    error: any,
    loadingSpinner?: boolean,
}) {
    const {
        data,
        status,
        error,
        loadingSpinner,
    } = props;
    let err = null;
    if (status === 'error' || (status === 'loading' && error != null)) {
        // This is needed to get the response data for a 401 request
        const myCustomErrorLet: any = {};
        myCustomErrorLet.data = error;

        let errorMessage: string | undefined;
        if (myCustomErrorLet?.data?.response?.data?.Error) {
            errorMessage = myCustomErrorLet.data.response.data.Error;
        } else if (data?.data?.Error) {
            errorMessage = data.data.Error;
        }

        if (typeof error === 'object' && error != null) {
            if (error.toString() !== '') {
                err = (
                    <Container maxWidth="xs">
                        <Alert severity="error">
                            <AlertTitle>{error.toString()}</AlertTitle>
                            {errorMessage}
                        </Alert>
                    </Container>
                );
            }
        } else {
            err = (
                <Container maxWidth="xs">
                    <Alert severity="error">
                        <AlertTitle>Could not extract data from server</AlertTitle>
                        {errorMessage}
                    </Alert>
                </Container>
            );
        }
    }
    if (status === 'loading' && loadingSpinner) {
        return (
            <>
                {err}
                <Loading />
            </>
        );
    }
    return err;
}

ErrorAxiosComponent.defaultProps = {
    loadingSpinner: true,
};
