import React from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';

import NoUsernameComp from '../../components/Compare/NoUsernameComp';
import { NoUsernameCompareInterface } from '../../components/Compare/CompareInterfaces';
import ErrorAxiosComponent from '../../components/ErrorAxiosComponent';

export default function NoUsername() {
    const { data, status, error } = useQuery('compare', () => axios.get<NoUsernameCompareInterface>('/api/compare', {
        withCredentials: true,
    }));

    const err = <ErrorAxiosComponent data={data} status={status} error={error} />;

    return (
        <>
            {err}
            <NoUsernameComp compare={data?.data} />
        </>
    );
}
