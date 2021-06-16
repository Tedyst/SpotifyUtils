import React from 'react';
import { Container } from '@material-ui/core';
import axios from 'axios';
import { useQuery } from 'react-query';
import { Alert, AlertTitle } from '@material-ui/lab';
import SearchBox from '../components/PlaylistSearchBox';
import ResultBox from '../components/ResultBox';
import { Playlist } from '../App';

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

    let errorComponent = null;
    if (status === 'error') {
        // This is needed to get the response data for a 401 request
        const myCustomErrorLet: any = {};
        myCustomErrorLet.data = error;

        let errorMessage: string = '';
        if (myCustomErrorLet?.data?.response?.data?.Error) {
            errorMessage = myCustomErrorLet.data.response.data.Error;
        } else if (data?.data?.Error) {
            errorMessage = data.data.Error;
        }

        if (typeof error === 'object' && error != null) {
            if (error.toString() !== '') {
                errorComponent = (
                    <Container maxWidth="xs">
                        <Alert severity="error">
                            <AlertTitle>{error.toString()}</AlertTitle>
                            {errorMessage}
                        </Alert>
                    </Container>
                );
            }
        } else {
            errorComponent = (
                <Container maxWidth="xs">
                    <Alert severity="error">
                        <AlertTitle>Could not extract data from server</AlertTitle>
                        {errorMessage}
                    </Alert>
                </Container>
            );
        }
    }

    return (
        <div>
            {errorComponent}
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
        </div>
    );
}
