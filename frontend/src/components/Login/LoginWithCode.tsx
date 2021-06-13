import React, { useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import LoginPage from '../Login/LoginPage';

export default function LoginWithCode(props: { code: string }) {
    const queryClient = useQueryClient();
    const { isLoading, error, data } = useQuery('auth', () => axios.post<AuthInterface>('/api/auth', {
        host: `${window.location.protocol}//${window.location.host}`,
        code: props.code,
    }, {
        withCredentials: true,
    }));
    useEffect(() => {
        if (data?.data.Success) {
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
    Success: boolean;
}
