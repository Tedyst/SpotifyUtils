import React from 'react';
import ResultBox from '../components/ResultBox';
import { Typography } from '@material-ui/core';
import Loading from '../components/Loading';
import axios from 'axios';
import { useQuery } from 'react-query';

export interface RecentInterface {
    Results: Result[];
    Success: boolean;
    Error: string;
}

export interface Result {
    Name: string;
    Artist: string;
    URI: string;
    Image: string;
}

const refetchIntervalSeconds = 60

export default function Recent() {
    const { data, status } = useQuery('recent', () =>
        axios.get<RecentInterface>('/api/recent', {
            withCredentials: true
        }), {
        refetchInterval: refetchIntervalSeconds * 1000,
        refetchOnWindowFocus: true
    })

    if (status === "loading")
        return <Loading />
    if (status === "error")
        return <Loading />
    if (data === undefined)
        return <Loading />
    if (data.data.Results === undefined)
        return <Loading />
    return (
        <div>
            <Typography component="h4" variant="h4" align="center">
                Your recent tracks
        </Typography>
            <br />
            <ResultBox results={data.data.Results} />
        </div>
    )
}