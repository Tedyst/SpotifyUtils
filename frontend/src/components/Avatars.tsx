import React from 'react';
import {
    makeStyles, withStyles, Avatar, Badge,
} from '@material-ui/core';
import { deepOrange, deepPurple } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
    purple: {
        color: theme.palette.getContrastText(deepPurple[500]),
        backgroundColor: deepPurple[500],
    },
    large: {
        width: theme.spacing(10),
        height: theme.spacing(10),
        color: theme.palette.getContrastText(deepOrange[500]),
        backgroundColor: deepOrange[500],
    },
    root: {
        margin: 'auto',
    },
}));

const SmallAvatar = withStyles((theme) => ({
    root: {
        width: theme.spacing(5),
        height: theme.spacing(5),
        border: `2px solid ${theme.palette.background.paper}`,
    },
}))(Avatar);

function Acronym(str: string) {
    const matches = str.match(/\b(\w)/g);
    if (matches === null) return str.charAt(0);
    const acronym = matches.join('');
    return acronym;
}

export default function Avatars(props: {
    target: {
        image: string,
        name: string,
    },
    initiator: {
        image: string,
        name: string,
    }
}) {
    const classes = useStyles();
    const { target, initiator } = props;
    return (
        <Badge
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            badgeContent={(
                <SmallAvatar className={classes.purple} src={initiator.image} alt={initiator.name}>
                    {Acronym(initiator.name)}
                </SmallAvatar>
            )}
            className={classes.root}
            overlap="circle"
        >
            <Avatar className={classes.large} sizes="120" src={target.image} alt={target.name}>
                {Acronym(target.name)}
            </Avatar>
        </Badge>
    );
}
