import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

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

export default function SongCard(props:{
    duration?: string,
    name: string,
    artist: string,
    image: string,
}) {
    const classes = useStyles();

    let duration = null;
    if(props.duration)
        duration = (
            <Typography variant="body2" color="textPrimary">
                When you only have <b>{props.duration}</b>, you know what you want
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
        </CardContent>
        </div>
        <CardMedia
            className={classes.cover}
            image={props.image}
        />
    </Card>);
}