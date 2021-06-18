import React from 'react';
import {
    useParams,
} from 'react-router-dom';
import axios from 'axios';
import { useQuery } from 'react-query';
import TrackAnalyze, { TrackParamTypes, TrackInterface } from '../components/Track/TrackAnalyze';
import ErrorAxiosComponent from '../components/ErrorAxiosComponent';
import ErrorComponent from '../components/ErrorComponent';
import TrackSearch from '../components/TrackSearch';

const refetchIntervalSeconds = 10;

export default function TrackAnalyzeController() {
    const { trackid } = useParams<TrackParamTypes>();
    const sanitizedTrack = trackid.replace(/[^a-zA-Z0-9]+/g, '').substring(0, 25);
    const { data, status, error } = useQuery(['track', sanitizedTrack], () => axios.get<TrackInterface>(`/api/track/${sanitizedTrack}`, {
        withCredentials: true,
    }), {
        refetchInterval: refetchIntervalSeconds * 1000,
        retry: false,
    });

    const err = <ErrorAxiosComponent data={data} status={status} error={error} />;

    // This is needed to get the response data for a 401 request
    const myCustomErrorLet: any = {};
    myCustomErrorLet.data = error;

    if (myCustomErrorLet?.data?.response?.data?.Success === false) {
        return (
            <>
                <ErrorComponent error="Track does not exist" />
                <TrackSearch />
            </>
        );
    }

    return (
        <>
            {err}
            <TrackAnalyze trackInfo={data?.data?.Result} />
        </>
    );
}
