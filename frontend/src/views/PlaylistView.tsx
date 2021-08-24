import React from 'react';
import { Container } from '@material-ui/core';
import axios from 'axios';
import { useQuery } from 'react-query';
import SearchBox from '../components/PlaylistSearchBox';
import ResultBox from '../components/ResultBox';
import { Playlist } from '../App';
import ErrorAxiosComponent from '../components/ErrorAxiosComponent';
import PlaylistAnalyze from '../components/PlaylistAnalyze';
import Loading from '../components/Loading';

export interface PlaylistResponse {
    Results: Track[];
    Success: boolean;
    Error?: string;
    Analyze: Analyze;
}

interface medianStruct {
    Highest: {
        Track: Track;
        Value: number;
    },
    Lowest: {
        Track: Track;
        Value: number;
    },
    Median: number;
}

export interface Analyze {
    Artists: { [key: string]: number };

    Energy: medianStruct;
    Acousticness: medianStruct;
    Instrumentalness: medianStruct;
    Popularity: medianStruct;
    Tempo: medianStruct;

    Genres: string[];
    Explicit: number;
}

export interface Result {
    Name: string;
    Artist: string;
    URI: string;
    Image: string;
}

export interface Track {
    Name: string;
    Artist: string;
    URI: string;
    Image: string;
    Count?: number;
}

export default function PlaylistSearch(props: {
    playlists: Playlist[] | undefined,
}) {
    const [selectedPlaylist, setSelectedPlaylist] = React.useState<string>();
    const { data, status, error } = useQuery(`/api/playlist/${selectedPlaylist}`, () => axios.get<PlaylistResponse>(`/api/playlist/${selectedPlaylist}`, {
        withCredentials: true,
    }), {
        enabled: !!selectedPlaylist,
    });
    const { playlists } = props;

    const err = (
        <ErrorAxiosComponent
            data={data}
            status={status}
            error={error}
            loadingSpinner={false}
        />
    );

    const loading = status === 'loading' ? <Loading /> : null;

    return (
        <>
            {err}
            <div style={{ height: '20px', width: '100%' }} />
            <Container maxWidth="xs">
                <SearchBox
                    setPlaylist={(s) => {
                        setSelectedPlaylist(s);
                    }}
                    playlists={playlists}
                    searching={!(status === 'success') && selectedPlaylist !== undefined}
                />
            </Container>
            <div style={{ height: '20px', width: '100%' }} />
            <PlaylistAnalyze analyze={data?.data.Analyze} />
            {loading}
            <div style={{ height: '20px', width: '100%' }} />
            <ResultBox results={data?.data.Results} />
        </>
    );
}
