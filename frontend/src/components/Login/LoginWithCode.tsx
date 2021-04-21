import React, { useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import LoginPage from '../Login/LoginPage';

export default function LoginWithCode(props: { code: string, CSRFToken: string }) {
    const queryClient = useQueryClient();
    const { isLoading, error, data } = useQuery('auth', () => axios.post<AuthInterface>('/api/auth', {
        host: `${window.location.protocol}//${window.location.host}`,
        code: props.code,
    }, {
        withCredentials: true,
        headers: {
            'X-CSRF-Token': props.CSRFToken,
        },
    }));
    useEffect(() => {
        if (data?.data.success) {
            queryClient.invalidateQueries('status');
            queryClient.invalidateQueries('top');
        }
    }, [data]);
    if (isLoading) {
        return <LoginPage loggingIn />;
    }
    if (error) {
        return <LoginPage loggingIn={false} />;
    }

    return <LoginPage loggingIn />;
}

interface AuthInterface {
    success: boolean;
}
