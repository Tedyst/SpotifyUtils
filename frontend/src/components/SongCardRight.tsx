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
        overflow: 'hidden',
    },
    content: {
        flex: '1 0 auto',
    },
    cover: {
        minWidth: 150,
        marginLeft: 'auto',
        overflowX: 'visible',
    },
    playIcon: {
        height: 38,
        width: 38,
    },
});

function msToText(ms: number): string {
    let seconds = Math.floor(ms / 1000);
    let minutes = Math.floor(seconds / 60);
    seconds %= 60;
    const hours = Math.floor(minutes / 60);
    minutes %= 60;
    if (hours === 1) {
        return `${hours} Hour ${minutes} Minutes and ${seconds} Seconds`;
    }
    if (hours !== 0) {
        return `${hours} Hours ${minutes} Minutes and ${seconds} Seconds`;
    }
    if (minutes !== 0) {
        if (seconds !== 0) return `${minutes} Minutes and ${seconds} Seconds`;
        return `${minutes} Minutes`;
    }
    return `${seconds} Seconds`;
}

function SongCard(props: {
    duration?: number | undefined,
    name: string,
    artist: string,
    image: string,
    count?: number,
}) {
    const classes = useStyles();
    const {
        duration,
        name,
        artist,
        image,
        count,
    } = props;
    let durationComponent = null;
    if (duration) {
        durationComponent = (
            <Typography variant="body2" color="textPrimary">
                When you only have
                {' '}
                <b>
                    {msToText(duration)}
                </b>
                , you know what you want
            </Typography>
        );
    }

    let countComponent = null;
    if (count) {
        countComponent = (
            <Typography variant="body2" color="textPrimary">
                You listened to this song
                {' '}
                <b>
                    {count}
                </b>
                {' '}
                times
            </Typography>
        );
    }

    const media = image !== '' ? (
        <CardMedia
            className={classes.cover}
            image={image}
        />
    ) : null;
    return (
        <Card className={classes.root}>
            <div className={classes.details}>
                <CardContent className={classes.content}>
                    <Typography component="h6" variant="h6">
                        {name}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        {artist}
                    </Typography>
                    {durationComponent}
                    {countComponent}
                </CardContent>
            </div>
            {media}
        </Card>
    );
}

SongCard.defaultProps = {
    count: undefined,
    duration: undefined,
};

export default SongCard;
