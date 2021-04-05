import React from 'react';
import { makeStyles, Avatar } from '@material-ui/core';
import { deepOrange } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
    large: {
        width: theme.spacing(5),
        height: theme.spacing(5),
        color: theme.palette.getContrastText(deepOrange[500]),
        backgroundColor: deepOrange[500],
        marginRight: theme.spacing(2),
    },
    root: {
        margin: 'auto',
    },
}));

function Acronym(str: string) {
    const matches = str.match(/\b(\w)/g);
    if (matches === null) return str.charAt(0);
    const acronym = matches.join('');
    return acronym;
}

export default function Avatars(props: {
    image: string,
    name: string
}) {
    const classes = useStyles();
    const { image, name } = props;
    return (
        <Avatar className={classes.large} sizes="120" src={image} alt={name}>
            {Acronym(name)}
        </Avatar>
    );
}
