import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';

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

export default function ArtistCard(props) {
    const classes = useStyles();

    let bestSong = null;
    if(props.bestSong)
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
