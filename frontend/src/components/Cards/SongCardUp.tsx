import React from 'react';
import {
    makeStyles, Card, CardContent, CardMedia, Typography, CardActions, Button,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { SongCardProps } from './SongCard';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'unset',
        flexDirection: 'column',
        alignItems: 'stretch',
        height: '100%',
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    content: {
        flex: '1 0 auto',
    },
    cover: {
        position: 'relative',
        paddingTop: '100%',
        width: '100%',
    },
    controls: {
        alignItems: 'center',
        paddingLeft: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        outline: 'none',
    },
    modalPaper: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        outline: 'none',
    },
    modalRoot: {
        minWidth: 300,
        position: 'absolute',
        top: '10%',
        bottom: '10%',
        overflow: 'scroll',
        height: '80%',
        display: 'block',
    },
    modalTitle: {
        fontSize: 14,
    },
    modalPos: {
        marginBottom: 12,
    },
    lyrics: {
        whiteSpace: 'pre-wrap',
    },
    button: {
        marginTop: 'auto',
        justifyContent: 'center',
    },
    count: {
        marginTop: 'auto',
    },
}));

function SongCardUp(props: SongCardProps) {
    const classes = useStyles();
    const { t } = useTranslation();
    const {
        uri,
        image,
        name,
        artist,
        count,
        usingLink,
        text,
    } = props;

    const cardAction = usingLink ? (
        <CardActions>
            <Button
                className={classes.button}
                component={Link}
                size="small"
                to={`/track/${uri}`}
            >
                {t('COMMON.INFORMATIONS')}
            </Button>
        </CardActions>
    ) : undefined;

    let countComponent = null;
    if (count) {
        if (count === 1) {
            countComponent = (
                <Typography className={classes.count} color="textSecondary" variant="subtitle2">
                    <Trans
                        i18nKey="COMMON.COUNT_TIME"
                        values={{ count }}
                        components={{ bold: <b /> }}
                    >
                        {'<bold>{{count}}</bold> time'}
                    </Trans>
                </Typography>
            );
        } else {
            countComponent = (
                <Typography className={classes.count} color="textSecondary" variant="subtitle2">
                    <Trans
                        i18nKey="COMMON.COUNT_TIMES"
                        values={{ count }}
                        components={{ bold: <b /> }}
                    >
                        {'<bold>{{count}}</bold> times'}
                    </Trans>
                </Typography>
            );
        }
    }
    return (
        <Card className={classes.root}>
            <CardMedia
                className={classes.cover}
                image={image}
                title={name}
            />
            <div className={classes.details}>
                <CardContent className={classes.content}>
                    <Typography component="h6" variant="h6">
                        {name}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        {artist}
                    </Typography>
                    {text}
                    <br />
                    {countComponent}
                </CardContent>
                {cardAction}
            </div>
        </Card>
    );
}

SongCardUp.defaultProps = {
    count: undefined,
    usingLink: true,
    text: undefined,
};

export default SongCardUp;
