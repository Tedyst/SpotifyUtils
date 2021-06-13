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
    Target: {
        Image: string,
        Name: string,
    },
    Initiator: {
        Image: string,
        Name: string,
    }
}) {
    const classes = useStyles();
    const { Target, Initiator } = props;
    return (
        <Badge
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            badgeContent={(
                <SmallAvatar className={classes.purple} src={Initiator.Image} alt={Initiator.Name}>
                    {Acronym(Initiator.Name)}
                </SmallAvatar>
            )}
            className={classes.root}
            overlap="circle"
        >
            <Avatar className={classes.large} sizes="120" src={Target.Image} alt={Target.Name}>
                {Acronym(Target.Name)}
            </Avatar>
        </Badge>
    );
}
