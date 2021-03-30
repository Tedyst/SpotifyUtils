import React from 'react';
import {
    useParams,
} from 'react-router-dom';
import axios from 'axios';
import { useQuery } from 'react-query';
import { Container } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

import Loading from '../components/Loading';
import TrackAnalyze, { TrackParamTypes, TrackInterface } from '../components/Track/TrackAnalyze';

export default function TrackAnalyzeController() {
    const { trackid } = useParams<TrackParamTypes>();
    const sanitizedTrack = trackid.replace(/[^a-zA-Z0-9]+/g, '').substring(0, 25);
    const { data, status, error } = useQuery(['track', sanitizedTrack], () => axios.get<TrackInterface>(`/api/track/${sanitizedTrack}`, {
        withCredentials: true,
    }));
    let errorComponent = null;
    if (status === 'error' || data?.data.Success === false) {
        if (typeof error === 'object' && error != null) {
            if (error.toString() !== '') {
                errorComponent = (
                    <Container maxWidth="xs">
                        <Alert severity="error">{error.toString()}</Alert>
                    </Container>
                );
            }
        } else {
            errorComponent = (
                <Container maxWidth="xs">
                    <Alert severity="error">Could not extract data from server</Alert>
                </Container>
            );
        }
        return (
            <div>
                {errorComponent}
                <Loading />
            </div>
        );
    }
    if (data === undefined || status === 'loading' || data?.data === undefined) return <Loading />;

    return <TrackAnalyze trackInfo={data.data.Result} />;
}
