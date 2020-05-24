import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        outline: 'none'
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        outline: 'none'
    },
    root: {
        minWidth: 400,
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    }
}));

export default function TransitionsModal(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className={classes.button}>
        <button type="button" onClick={handleOpen} className={classes.button}>
            react-transition-group
        </button>
        <Modal
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
            <Card className={classes.root}>
                <CardContent>
                    <Typography variant="h5" component="h2">
                    {props.name}
                    </Typography>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                    {props.artist}
                    </Typography>
                    <Typography variant="body2" component="p">
                    {props.lyrics}
                    </Typography>
                </CardContent>
            </Card>
        </Fade>
        </Modal>
        </div>
    );
}
