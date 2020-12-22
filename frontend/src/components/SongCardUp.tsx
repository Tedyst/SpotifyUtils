import React from 'react';
import { makeStyles, Card, CardContent, CardMedia, Typography, Fade, CardActions, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'unset',
        flexDirection: 'column',
        alignItems: 'stretch',
        height: '100%'
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
    },
    content: {
        flex: '1 0 auto',
    },
    cover: {
        position: 'relative',
        paddingTop: '100%',
        width: '100%'
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
        outline: 'none'
    },
    modalPaper: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        outline: 'none'
    },
    modalRoot: {
        minWidth: 300,
        position: 'absolute',
        top: '10%',
        bottom: '10%',
        overflow: 'scroll',
        height: '80%',
        display: 'block'
    },
    modalTitle: {
        fontSize: 14,
    },
    modalPos: {
        marginBottom: 12,
    },
    lyrics: {
        whiteSpace: "pre-wrap",
    },
    button: {
        marginTop: 'auto',
        justifyContent: 'center'
    },
    count: {
        marginTop: 'auto',
    }
}));

export default function SongCard(props: {
    uri: string,
    image: string,
    name: string,
    artist: string,
    count?: number,
}) {
    const classes = useStyles();

    let cardAction = (<CardActions>
        <Button
            size="small"
            component={Link}
            to={"/track/" + props.uri}
            className={classes.button}
        >Informations</Button>
    </CardActions>);

    let count = null;
    if (props.count)
        count = (<Typography variant="subtitle2" color="textSecondary" className={classes.count}>
            <b>{props.count}</b> times
        </Typography>)
    return (
        <Fade in={true}>
            <Card className={classes.root}>
                <CardMedia
                    className={classes.cover}
                    image={props.image}
                    title={props.name}
                />
                <div className={classes.details}>
                    <CardContent className={classes.content}>
                        <Typography component="h6" variant="h6">
                            {props.name}
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                            {props.artist}
                        </Typography>
                        {count}
                    </CardContent>
                    {cardAction}
                </div>
            </Card>
        </Fade>
    );
}

SongCard.defaultProps = {
    image: "https://i.scdn.co/image/ab67616d0000b273f817f90531b8b396b370ab0d",
    name: "Show & Tell",
    artist: "Said The Sky"
}