import React from 'react';
import {
    makeStyles, Card, CardContent, CardMedia, Typography, Fade,
} from '@material-ui/core';
import { Trans } from 'react-i18next';

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
    image?: string,
    name: string,
    fade?: boolean,
}) {
    const classes = useStyles();

    const {
        bestSong, image, name, fade,
    } = props;
    let song = null;
    if (bestSong) {
        song = (
            <Typography variant="body2" color="textPrimary">
                <Trans
                    i18nKey="COMMON.YOU_REALLY_LOVE_THE_SONG"
                    values={{ song: props.bestSong }}
                    components={{ bold: <b /> }}
                >
                    {'You really love the song <bold>{{song}}</bold>'}
                </Trans>
            </Typography>
        );
    }

    const cardmedia = image ? (
        <CardMedia
            className={classes.cover}
            image={image}
        />
    ) : undefined;
    const card = (
        <Card className={classes.root}>
            {cardmedia}
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
    if (fade) {
        return (
            <Fade in>
                {card}
            </Fade>
        );
    }
    return card;
}

ArtistCard.defaultProps = {
    bestSong: undefined,
    image: undefined,
};

export default ArtistCard;
