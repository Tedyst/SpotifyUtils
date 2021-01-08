import React from 'react';
import { CssBaseline, Container } from '@material-ui/core';
import SearchBox from '../components/PlaylistSearchBox';
import ResultBox from '../components/ResultBox';
import axios from 'axios';
import { useQuery } from 'react-query';
import { StatusInterface } from '../App';
import Loading from '../components/Loading';

export default function PlaylistSearch() {
    const { data, status } = useQuery('status', () =>
        axios.get<StatusInterface>('/api/status', {
            withCredentials: true
        }))
    const playlists = data?.data.playlists === undefined ? [] : data.data.playlists;
    const [Results, setResults] = React.useState([]);
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