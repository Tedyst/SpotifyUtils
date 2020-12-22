import React from 'react';
import { makeStyles, Card, CardContent, CardMedia, Typography } from '@material-ui/core';

const useStyles = makeStyles({
    root: {
        display: 'flex',
        minHeight: 150,
        maxWidth: '100%'
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
        marginRight: 'auto',
    },
    content: {
        flex: '1 0 auto'
    },
    cover: {
        minWidth: 150,
    },
    playIcon: {
        height: 38,
        width: 38,
    },
});

export default function ArtistCard(props: {
    bestSong?: string,
    image: string,
    name: string
}) {
    const classes = useStyles();

    let bestSong = null;
    if (props.bestSong)
        bestSong = (
            <Typography variant="body2" color="textPrimary">
                You really love the song
                <b> {props.bestSong}</b>
            </Typography>
        );

    return (
        <Card className={classes.root}>
            <CardMedia
                className={classes.cover}
                image={props.image}
            />
            <div className={classes.details}>
                <CardContent className={classes.content}>
                    <Typography component="h6" variant="h6">
                        {props.name}
                    </Typography>
                    {bestSong}
                </CardContent>
            </div>
        </Card>);
}
