import React, { useEffect } from 'react';
import { QueryClient } from 'react-query';
import Loading from '../../components/Loading';

export default function Logout() {
    const queryClient = new QueryClient();

    useEffect(() => {
        fetch('/api/logout', { cache: 'no-store', credentials: 'same-origin' }).then(() => {
            localStorage.clear();
            queryClient.invalidateQueries();
            window.location.reload();
        });
    });

    return <Loading />;
}
