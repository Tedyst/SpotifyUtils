import React from 'react';
import { Container } from '@material-ui/core';
import axios from 'axios';
import { useQuery } from 'react-query';
import SearchBox from '../components/PlaylistSearchBox';
import ResultBox from '../components/ResultBox';
import { Playlist } from '../App';
import ErrorAxiosComponent from '../components/ErrorAxiosComponent';

export interface PlaylistResponse {
    Results: Track[];
    Success: boolean;
    Error?: string;
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

    const err = <ErrorAxiosComponent data={data} status={status} error={error} />;

    return (
        <>
            {err}
            <Container maxWidth="xs">
                <SearchBox
                    setPlaylist={(s) => {
                        setSelectedPlaylist(s);
                    }}
                    playlists={playlists}
                    searching={!(status === 'success') && selectedPlaylist !== undefined}
                />
            </Container>
            <ResultBox results={data?.data.Results} />
        </>
    );
}
