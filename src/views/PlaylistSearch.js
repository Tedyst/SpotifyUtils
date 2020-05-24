import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import SearchBox from '../sections/PlaylistSearch/SearchBox';
import {
  selectPlaylists
} from '../store/user';
import { useSelector } from 'react-redux';
import ResultBox from '../sections/PlaylistSearch/ResultBox';

export default function PlaylistSearch() {
    const playlists = useSelector(selectPlaylists);
    const [Results, setResults] = React.useState([]);
    console.log(Results);
    return (
        <div>
        <Container maxWidth="xs">
            <SearchBox
                setResults={setResults}
                playlists={playlists}
            />
            <CssBaseline />
        </Container>
        <ResultBox results={Results}/>
        </div>
    )
}