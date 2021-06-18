import React from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';

import RecentComp, { RecentInterface } from '../components/Recent/RecentComp';
import ErrorAxiosComponent from '../components/ErrorAxiosComponent';

const refetchIntervalSeconds = 30;

export default function RecentPage() {
    const { data, status, error } = useQuery('recent', () => axios.get<RecentInterface>('/api/recent', {
        withCredentials: true,
    }), {
        refetchInterval: refetchIntervalSeconds * 1000,
        refetchOnWindowFocus: true,
        staleTime: refetchIntervalSeconds * 1000,
    });

    const err = <ErrorAxiosComponent data={data} status={status} error={error} />;

    return (
        <>
            {err}
            <RecentComp results={data?.data?.Results} />
        </>
    );
}
