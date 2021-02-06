import React from 'react';
import {
    makeStyles, Card, CardContent, CardMedia, Typography,
} from '@material-ui/core';

const useStyles = makeStyles({
    root: {
        display: 'flex',
        minHeight: 150,
        maxWidth: '100%',
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
        marginRight: 'auto',
    },
    content: {
        flex: '1 0 auto',
    },
    cover: {
        minWidth: 150,
    },
    playIcon: {
        height: 38,
        width: 38,
    },
});

function ArtistCard(props: {
    bestSong?: string,
    image: string,
    name: string
}) {
    const classes = useStyles();

    const { bestSong, image, name } = props;
    let song = null;
    if (bestSong) {
        song = (
            <Typography variant="body2" color="textPrimary">
                You really love the song
                <b>
                    {' '}
                    {props.bestSong}
                </b>
            </Typography>
        );
    }

    return (
        <Card className={classes.root}>
            <CardMedia
                className={classes.cover}
                image={image}
            />
            <div className={classes.details}>
                <CardContent className={classes.content}>
                    <Typography component="h6" variant="h6">
                        {name}
                    </Typography>
                    {song}
                </CardContent>
            </div>
        </Card>
    );
}

ArtistCard.defaultProps = {
    bestSong: undefined,
};

export default ArtistCard;
