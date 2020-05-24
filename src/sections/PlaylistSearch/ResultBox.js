import React from 'react';
import Container from '@material-ui/core/Container';
import { Grid } from '@material-ui/core';
import SongCard from '../../components/SongCard'

export default function ResultBox(props) {
    if(props.results === [])
        return null
    let items = [];
    items = props.results.map((item, key) => (<SongCard
                    key={key}
                    name={item.name}
                    artist={item.artist}
                />));
    return (
        <Container maxWidth="lg">
            <Grid container spacing={2}>
                <Grid item xs={4} md={3} sm={6} lg={2}>
                    {items}
                </Grid>
            </Grid>
        </Container>
    )
}