import React from 'react';
import Container from '@material-ui/core/Container';
import { Grid } from '@material-ui/core';
import SongCardRight from './SongCardRight'

export default function ResultBox(props:{
    results: {
        uri: string,
        name: string,
        artist: string,
        image_url: string,
    }[]
}) {
    if (props.results === null)
        return null
    let items = [];
    items = props.results.map((item, key) => (
        <Grid item xs={6} md={3} sm={4} lg={2} key={item.uri}>
            <SongCardRight
                key={item.uri}
                name={item.name}
                artist={item.artist}
                image={item.image_url}
            />
        </Grid>
    ));
    return (
        <Container maxWidth="lg" disableGutters={true}>
            <Grid container spacing={1}>
                {items}
            </Grid>
        </Container>
    )
}