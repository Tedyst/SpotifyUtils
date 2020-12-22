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
        overflow: 'hidden'
    },
    content: {
        flex: '1 0 auto'
    },
    cover: {
        minWidth: 150,
        marginLeft: 'auto',
        overflowX: "visible"
    },
    playIcon: {
        height: 38,
        width: 38,
    },
});

export default function SongCard(props: {
    duration?: string,
    name: string,
    artist: string,
    image: string,
    count?: number,
}) {
    const classes = useStyles();

    let duration = null;
    if (props.duration)
        duration = (
            <Typography variant="body2" color="textPrimary">
                When you only have <b>{props.duration}</b>, you know what you want
            </Typography>
        )

    let count = null;
    if (props.count)
        count = (
            <Typography variant="body2" color="textPrimary">
                You listened to this song <b>{props.count}</b> times
            </Typography>
        )

    return (
        <Card className={classes.root}>
            <div className={classes.details}>
                <CardContent className={classes.content}>
                    <Typography component="h6" variant="h6">
                        {props.name}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        {props.artist}
                    </Typography>
                    {duration}
                    {count}
                </CardContent>
            </div>
            <CardMedia
                className={classes.cover}
                image={props.image}
            />
        </Card>);
}
