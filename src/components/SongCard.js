import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';


const useStyle = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'unset',
        flexDirection: 'column',
        height: 'auto'
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
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
    playIcon: {
        height: 38,
        width: 38,
    },
}));

export default function PlaylistCardDesktop(props) {
    const desktop = useStyle();

    return (
        <Card className={desktop.root}>
        <CardMedia
            className={desktop.cover}
            image={props.image}
            title={props.name}
        />
        <div className={desktop.details}>
            <CardContent className={desktop.content}>
                <Typography component="h6" variant="h6">
                    {props.name}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                    {props.artist}
                </Typography>
            </CardContent>
            {/* <div className={desktop.controls}>
                <IconButton aria-label="play/pause">
                    <PlayArrowIcon className={desktop.playIcon} />
                </IconButton>
            </div> */}
        </div>
    </Card>
    );
}

PlaylistCardDesktop.defaultProps = {
    image: "https://i.scdn.co/image/ab67616d0000b273f817f90531b8b396b370ab0d",
    name: "Show & Tell",
    artist: "Said The Sky"
}