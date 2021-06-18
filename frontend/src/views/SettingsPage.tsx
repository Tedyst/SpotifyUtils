import React from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';

import SettingsPage from '../components/Settings/SettingsPage';
import { StatusInterface } from '../App';
import ErrorAxiosComponent from '../components/ErrorAxiosComponent';

export default function SettingsController() {
    const { data, status, error } = useQuery('status', () => axios.get<StatusInterface>('/api/status', {
        withCredentials: true,
    }));

    const err = <ErrorAxiosComponent data={data} status={status} error={error} />;

    return (
        <>
            {err}
            <SettingsPage
                settings={data?.data?.Settings}
            />
        </>
    );
}
