import React from 'react';
import Container from '@material-ui/core/Container';
import { Grid } from '@material-ui/core';
import SongCardUp from './SongCardUp'

export default function ResultBox(props:{
    results: {
        URI: string,
        Name: string,
        Artist: string,
        Image: string,
        Count?: number,
    }[]
}) {
    if (props.results === undefined)
        return null
    let items = [];
    items = props.results.map((item, index) => (
        <Grid item xs={6} md={3} sm={4} lg={2} key={item.URI + index}>
            <SongCardUp
                key={item.URI + index}
                uri={item.URI}
                name={item.Name}
                artist={item.Artist}
                image={item.Image}
                count={item.Count}
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