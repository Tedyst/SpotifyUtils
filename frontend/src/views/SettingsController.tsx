import React from 'react';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import SettingsPage, { SettingsInterface, Settings } from '../components/Settings/SettingsPage';
import Loading from '../components/Loading';

export default function SettingsController() {
    const queryClient = useQueryClient();
    const { data, status } = useQuery('settings', () => axios.get<SettingsInterface>('/api/settings', {
        withCredentials: true,
    }));
    const CSRFToken = data?.headers['x-csrf-token'];
    if (status === 'loading' || status === 'error' || data === undefined || data.data.Success === false) {
        return <Loading />;
    }

    const mutation = useMutation((set: Settings) => axios.post<Settings>('/api/settings', JSON.stringify(set), {
        withCredentials: true,
        headers: {
            'X-CSRF-Token': CSRFToken,
        },
    }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('settings');
            },
        });

    return (
        <SettingsPage
            mutation={mutation}
            data={data.data}
        />
    );
}
