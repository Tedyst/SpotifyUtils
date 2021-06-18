import React from 'react';
import {
    useParams,
} from 'react-router-dom';
import axios from 'axios';
import { useQuery } from 'react-query';

import UsernameComp from '../../components/Compare/UsernameComp';
import { UsernameInterface } from '../../components/Compare/CompareInterfaces';
import ErrorAxiosComponent from '../../components/ErrorAxiosComponent';

interface ParamTypes {
    code: string
}

export default function Username() {
    const { code } = useParams<ParamTypes>();
    const sanitizedCode = code.replace(/[^a-zA-Z0-9]+/g, '').substring(0, 6);
    const { data, status, error } = useQuery(['compare', sanitizedCode], () => axios.get<UsernameInterface>(`/api/compare/${sanitizedCode}`, {
        withCredentials: true,
    }));

    const err = <ErrorAxiosComponent data={data} status={status} error={error} />;

    return (
        <>
            {err}
            <UsernameComp data={data?.data} />
        </>
    );
}
