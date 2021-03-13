import React from 'react';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import SettingsComp from '../components/Settings/SettingsComp';
import Loading from '../components/Loading';

export interface SettingsInterface {
    Success: boolean;
    Settings: Settings;
}

export interface Settings {
    RecentTracks: boolean;
}

export default function SettingsLogic() {
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

    return <SettingsComp mutation={mutation} originalSettings={data.data.Settings} />;
}
