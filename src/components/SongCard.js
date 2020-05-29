import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';

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
        position:'absolute',
        top:'10%',
        bottom: '10%',
        overflow:'scroll',
        height: '80%',
        display:'block'
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
    }
}));

export default function SongCard(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    let modal = (<Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
        <Fade in={open}>
            <Card className={classes.modalRoot}>
                <CardContent>
                    <Typography variant="h5" component="h2">
                    {props.name}
                    </Typography>
                    <Typography className={classes.modalTitle} color="textSecondary" gutterBottom>
                    {props.artist}
                    </Typography>
                    <Typography variant="body2" component="p" className={classes.lyrics}>
                    {props.lyrics}
                    </Typography>
                </CardContent>
            </Card>
        </Fade>
        </Modal>);

    let cardAction = (<CardActions>
                <Button
                    size="small"
                    onClick={handleOpen}
                    className={classes.button}
                >See lyrics</Button>
            </CardActions>);

    if(props.lyrics === undefined){
        cardAction = null;
        modal = null;
    }

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
            </CardContent>
            {cardAction}
        </div>
        {modal}
    </Card>
    </Fade>
    );
}

SongCard.defaultProps = {
    image: "https://i.scdn.co/image/ab67616d0000b273f817f90531b8b396b370ab0d",
    name: "Show & Tell",
    artist: "Said The Sky"
}