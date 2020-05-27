import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { deepOrange } from '@material-ui/core/colors';
import Badge from '@material-ui/core/Badge';

const useStyles = makeStyles((theme) => ({
    orange: {
        color: theme.palette.getContrastText(deepOrange[500]),
        backgroundColor: deepOrange[500],
    },
    large: {
        width: theme.spacing(10),
        height: theme.spacing(10),
        color: theme.palette.getContrastText(deepOrange[500]),
        backgroundColor: deepOrange[500]
    },
    root: {
        margin: "auto",
    }
}));

const SmallAvatar = withStyles((theme) => ({
    root: {
        width: theme.spacing(5),
        height: theme.spacing(5),
        border: `2px solid ${theme.palette.background.paper}`,
    },
}))(Avatar);

function Acronym(str){
    var matches = str.match(/\b(\w)/g);
    var acronym = matches.join('');
    return acronym;
}

export default function Avatars(props){
    const classes = useStyles();

    return (<Badge
                overlap="circle"
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                className={classes.root}
                badgeContent={<SmallAvatar src={props.initiator.image} className={classes.orange}>
                                {Acronym(props.initiator.name)}
                            </SmallAvatar>}
            >
                <Avatar src={props.target.image} className={classes.large} >
                    {Acronym(props.target.name)}
                </Avatar>
            </Badge>
    )
}
