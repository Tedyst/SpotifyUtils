import React, { useEffect } from 'react';
import axios from 'axios';
import { useQueryClient } from 'react-query';
import Loading from '../../components/Loading';

export default function Logout() {
    const queryClient = useQueryClient();

    useEffect(() => {
        axios.get('/api/logout').then(() => {
            queryClient.invalidateQueries();
            setTimeout(() => {
                window.localStorage.clear();
            }, 1000);
        });
    }, []);

    return <Loading />;
}
