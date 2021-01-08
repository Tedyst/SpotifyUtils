import React from 'react';
import { CssBaseline, Container } from '@material-ui/core';
import SearchBox from '../components/PlaylistSearchBox';
import ResultBox from '../components/ResultBox';
import axios from 'axios';
import { useQuery } from 'react-query';
import { StatusInterface } from '../App';
import Loading from '../components/Loading';
import Alert from '@material-ui/lab/Alert';

export default function PlaylistSearch() {
    const { data, status, error } = useQuery('status', () =>
        axios.get<StatusInterface>('/api/status', {
            withCredentials: true
        }))
    const playlists = data?.data.playlists === undefined ? [] : data.data.playlists;
    const [Results, setResults] = React.useState([]);
    let errorComponent = null;
    if (status === "error" || data?.data.success === false) {
        if (typeof error === "object" && error != null) {
            if (error.toString() !== "") {
                errorComponent =
                    <Container maxWidth="xs">
                        <Alert severity="error">{error.toString()}</Alert>
                    </Container>
            }
        } else {
            errorComponent =
                <Container maxWidth="xs">
                    <Alert severity="error">Could not extract data from server</Alert>
                </Container>
        }
        return <div>
            {errorComponent}
            <Loading />
        </div>
    }
    let result = <Loading />;
    if (status === "success")
        result = <ResultBox results={Results} />;
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
    )
}