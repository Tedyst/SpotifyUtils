import React from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';

import NoUsernameComp from '../../components/Compare/NoUsernameComp';
import { NoUsernameCompareInterface } from '../../components/Compare/CompareInterfaces';
import ErrorAxiosComponent from '../../components/ErrorAxiosComponent';

export default function NoUsername() {
    const { data, status, error } = useQuery('compare', () => axios.get<NoUsernameCompareInterface>('/api/compare', {
        withCredentials: true,
    }), {
        cacheTime: 10000, // 10 seconds
        staleTime: 10000,
        refetchInterval: 10000,
    });

    const err = <ErrorAxiosComponent data={data} status={status} error={error} />;

    return (
        <>
            {err}
            <NoUsernameComp compare={data?.data} />
        </>
    );
}
