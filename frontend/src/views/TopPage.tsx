import React from 'react';

import { useQuery } from 'react-query';
import axios from 'axios';
import TopComp, { TopInterface } from '../components/Top/TopComp';
import ErrorAxiosComponent from '../components/ErrorAxiosComponent';

export default function Top() {
    const { data, status, error } = useQuery('top', () => axios.get<TopInterface>('/api/top', {
        withCredentials: true,
    }));

    const err = <ErrorAxiosComponent data={data} status={status} error={error} />;
    const top = data?.data;

    return (
        <>
            {err}
            <TopComp top={top} />
        </>
    );
}
