import React from 'react';
import axios from 'axios';
import { useMutation, useQuery } from 'react-query';

import { Alert, AlertTitle } from '@material-ui/lab';
import { useParams } from 'react-router-dom';
import { Container } from '@material-ui/core';
import SettingsPage from '../components/Settings/SettingsPage';
import { StatusInterface } from '../App';
import ErrorAxiosComponent from '../components/ErrorAxiosComponent';
import Loading from '../components/Loading';

export interface DiscordLink {
    Token: string;
}

interface ParamTypes {
    token: string
}

export default function DiscordLinkPage() {
    const { data, status, error } = useQuery('status', () => axios.get<StatusInterface>('/api/status', {
        withCredentials: true,
    }));

    const { token } = useParams<ParamTypes>();
    const err = <ErrorAxiosComponent data={data} status={status} error={error} />;

    const mutation = useMutation((link: DiscordLink) => axios.post('/api/discord', JSON.stringify(link), {
        withCredentials: true,
    }));

    let discordLinkComponent = null;
    if (mutation.isLoading) {
        discordLinkComponent = <Loading />;
    } else if (mutation.isError) {
        discordLinkComponent = (
            <ErrorAxiosComponent
                data={mutation.data}
                status={mutation.status}
                error={mutation.error}
            />
        );
    } else if (mutation.isSuccess) {
        discordLinkComponent = (
            <Container maxWidth="xs">
                <Alert severity="success">
                    <AlertTitle>Discord account has been linked</AlertTitle>
                </Alert>
                <br />
            </Container>
        );
    }

    return (
        <>
            {err}
            {discordLinkComponent}
            <SettingsPage
                settings={data?.data?.Settings}
                // eslint-disable-next-line max-len
                discordLink={mutation.isSuccess ? undefined : () => { mutation.mutate({ Token: token }); }}
            />
            <br />
        </>
    );
}
