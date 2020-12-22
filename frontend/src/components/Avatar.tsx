import React from 'react';
import { makeStyles, Avatar } from '@material-ui/core';
import { deepOrange } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
    large: {
        width: theme.spacing(5),
        height: theme.spacing(5),
        color: theme.palette.getContrastText(deepOrange[500]),
        backgroundColor: deepOrange[500],
        marginRight: theme.spacing(2)
    },
    root: {
        margin: "auto",
    }
}));

function Acronym(str: string) {
    var matches = str.match(/\b(\w)/g);
    if (matches === null)
        return str.charAt(0);
    var acronym = matches.join('');
    return acronym;
}

export default function Avatars(props: {
    image: string,
    name: string
}) {
    const classes = useStyles();

    return (
        <Avatar src={props.image} className={classes.large} sizes={"120"}>
            {Acronym(props.name)}
        </Avatar>
    )
}
