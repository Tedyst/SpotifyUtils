import React from 'react';
import {
    makeStyles, Card, CardContent, CardMedia, Typography, Fade, CardActions, Button,
} from '@material-ui/core';
import { Link } from 'react-router-dom';

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

function SongCardUp(props: {
    uri: string,
    image: string,
    name: string,
    artist: string,
    count?: number,
}) {
    const classes = useStyles();
    const {
        uri,
        image,
        name,
        artist,
        count,
    } = props;

    const cardAction = (
        <CardActions>
            <Button
                className={classes.button}
                component={Link}
                size="small"
                to={`/track/${uri}`}
            >
                Informations
            </Button>
        </CardActions>
    );

    let countComponent = null;
    if (count) {
        countComponent = (
            <Typography className={classes.count} color="textSecondary" variant="subtitle2">
                <b>
                    {count}
                </b>
                {' '}
                times
            </Typography>
        );
    }
    return (
        <Fade in>
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
                        {countComponent}
                    </CardContent>
                    {cardAction}
                </div>
            </Card>
        </Fade>
    );
}

SongCardUp.defaultProps = {
    count: undefined,
};

export default SongCardUp;
