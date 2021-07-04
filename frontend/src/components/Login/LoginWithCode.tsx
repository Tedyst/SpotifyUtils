import React from 'react';
import { useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import LoginPage from '../Login/LoginPage';

export default function LoginWithCode(props: { code: string, CSRFToken: string | undefined }) {
    const queryClient = useQueryClient();
    const { CSRFToken } = props;
    const { isLoading, error, data } = useQuery('auth', () => axios.post<AuthInterface>('/api/auth', {
        host: `${window.location.protocol}//${window.location.host}`,
        code: props.code,
    }, {
        withCredentials: true,
    }), {
        enabled: !!CSRFToken,
    });
    if (data?.data.Success) {
        const lastURL = window.localStorage.getItem('lastURL');
        queryClient.invalidateQueries();
        if (lastURL !== '' && lastURL) {
            setTimeout(() => {
                window.localStorage.removeItem('lastURL');
            }, 1000);
            return <Redirect to={`${lastURL}`} />;
        }
    }
    if (isLoading) {
        return <LoginPage loggingIn />;
    }
    if (error) {
        return <LoginPage loggingIn={false} />;
    }

    return <LoginPage loggingIn />;
}

interface AuthInterface {
    Success: boolean;
}
