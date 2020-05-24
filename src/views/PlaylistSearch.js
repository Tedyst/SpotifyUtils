import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import PlaylistView from '../sections/PlaylistSearch/SearchBox';
import {
  selectPlaylists
} from '../store/user';
import { useSelector } from 'react-redux';
import ResultBox from '../sections/PlaylistSearch/ResultBox';

export default function PlaylistSearch() {
    const playlists = useSelector(selectPlaylists);
    let results = [
        {
            "id": "test",
            "name": "Test Name",
            "artist": "Test Artist",
            "image": ""
        }
    ]
    return (
        <div>
        <Container maxWidth="xs">
            <PlaylistView playlists={playlists}/>
            <CssBaseline />
        </Container>
        <ResultBox results={results}/>
        </div>
    )
}