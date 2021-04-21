import React from 'react';
import { CssBaseline, Container } from '@material-ui/core';
import axios from 'axios';
import { useQuery } from 'react-query';
import { Alert, AlertTitle } from '@material-ui/lab';
import SearchBox from '../components/PlaylistSearchBox';
import ResultBox from '../components/ResultBox';
import { StatusInterface } from '../App';
import Loading from '../components/Loading';

export default function PlaylistSearch() {
    const { data, status, error } = useQuery('status', () => axios.get<StatusInterface>('/api/status', {
        withCredentials: true,
    }));
    const playlists = data?.data.playlists === undefined ? [] : data.data.playlists;
    const [Results, setResults] = React.useState([]);
    let errorComponent = null;
    if (status === 'error' || data?.data.success === false) {
        const errorMessage = data?.data.error ? data.data.error : null;
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
        return (
            <div>
                {errorComponent}
                <Loading />
            </div>
        );
    }
    let result = <Loading />;
    if (status === 'success') result = <ResultBox results={Results} />;
    return (
        <div>
            <Container maxWidth="xs">
                <SearchBox
                    setResults={setResults}
                    playlists={playlists}
                />
                <CssBaseline />
            </Container>
            {result}
        </div>
    );
}
