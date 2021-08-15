import React from 'react';
import {
    makeStyles, Card, CardContent, CardMedia, Typography,
} from '@material-ui/core';
import { HumanizeDuration, HumanizeDurationLanguage } from 'humanize-duration-ts';
import { Trans } from 'react-i18next';
import i18n from '../i18n';

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
    const langService = new HumanizeDurationLanguage();
    const humanizer = new HumanizeDuration(langService);
    humanizer.setOptions({
        language: i18n.languages[0],
    });
    return humanizer.humanize(ms - (ms % 1000));
}

function SongCard(props: {
    duration?: number | undefined,
    name: string | undefined,
    artist: string | undefined,
    image: string | undefined,
    count?: number | undefined,
}) {
    const classes = useStyles();
    const {
        duration,
        name,
        artist,
        image,
        count,
    } = props;
    if (!name || !artist) {
        return null;
    }
    let durationComponent = null;
    if (duration) {
        durationComponent = (
            <Typography variant="body2" color="textPrimary">
                <Trans
                    i18nKey="COMMON.WHEN_YOU_ONLY_HAVE"
                    values={{ duration: msToText(duration) }}
                    components={{ bold: <b /> }}
                >
                    {'When you only have <bold>{{duration}}</bold>, you know what you want'}
                </Trans>
            </Typography>
        );
    }

    let countComponent = null;
    if (count) {
        countComponent = (
            <Typography variant="body2" color="textPrimary">
                <Trans
                    i18nKey="COMMON.YOU_LISTENED_TO_THIS_SONG"
                    values={{ count }}
                    components={{ bold: <b /> }}
                >
                    {'You listened to this song <bold>{{count}}</bold> times'}
                </Trans>
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
