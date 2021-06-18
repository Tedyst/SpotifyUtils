import React from 'react';
import { Container } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';

export default function ErrorComponent(props: {
    error: string,
}) {
    const { error } = props;
    return (
        <Container maxWidth="xs">
            <Alert severity="error">
                <AlertTitle>{error}</AlertTitle>
            </Alert>
        </Container>
    );
}
