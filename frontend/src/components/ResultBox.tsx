import React from 'react';
import { Grid, Container } from '@material-ui/core';
import SongCard from './Cards/SongCard';

export interface Result {
    Name: string;
    Artist: string;
    URI: string;
    Image: string;
    Count?: number;
}
export default function ResultBox(props: {
    results: Result[] | undefined,
    usingLink?: boolean,
}) {
    const { results, usingLink } = props;
    if (results === undefined || results === null) return null;
    let items = [];
    items = results.map((item) => (
        <Grid item xs={6} md={3} sm={4} lg={2} key={`${item.URI}-result`}>
            <SongCard
                type="up"
                key={`${item.URI}-result`}
                uri={item.URI}
                name={item.Name}
                artist={item.Artist}
                image={item.Image}
                count={item.Count}
                usingLink={usingLink}
                fade
            />
        </Grid>
    ));
    return (
        <Container maxWidth="lg" disableGutters>
            <Grid container spacing={1}>
                {items}
            </Grid>
        </Container>
    );
}

ResultBox.defaultProps = {
    usingLink: true,
};
