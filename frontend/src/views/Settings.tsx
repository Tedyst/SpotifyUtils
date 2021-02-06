import React from 'react';
import axios from 'axios';
import {
    useQuery,
} from 'react-query';
import Settings, { SettingsInterface } from '../components/Settings/Settings';
import Loading from '../components/Loading';

export default function SettingsWrapper() {
    const { data, status } = useQuery('settings', () => axios.get<SettingsInterface>('/api/settings', {
        withCredentials: true,
    }));
    if (status === 'loading' || status === 'error' || data === undefined || data.data.Success === false) {
        return <Loading />;
    }
    return <Settings originalSettings={data.data.Settings} CSRFToken={data.headers['x-csrf-token']} />;
}
