import React from 'react';
import Container from '@material-ui/core/Container';
import { Grid } from '@material-ui/core';
import SongCard from '../../components/SongCard'

export default function ResultBox(props) {
    if(props.results === [])
        return null
    let items = [];
    items = props.results.map((item, key) => (
        <Grid item xs={6} md={3} sm={4} lg={2} key={item.uri}>
            <SongCard
                key={item.uri}
                name={item.name}
                artist={item.artist}
                image={item.image_url}
                lyrics={item.lyrics}
            />
        </Grid>
    ));
    return (
        <Container maxWidth="lg">
            <Grid container spacing={2}>
                {items}
            </Grid>
        </Container>
    )
}