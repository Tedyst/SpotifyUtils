import React from 'react';
import { makeStyles, List, ListItem, ListItemText, ListSubheader } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        position: 'relative',
        overflow: 'auto',
        maxHeight: 400,
    },
    listSection: {
        backgroundColor: 'inherit',
    },
    ul: {
        backgroundColor: 'inherit',
        padding: 0,
    },
    textColor: {
        color: theme.palette.info.light
    }
}));

export default function ListItems(props: {
    items: any[],
    name: string
}) {
    const classes = useStyles();

    let items: any[] = [];
    if (props.items.length === 0 || !props.items)
        return (
            <List className={classes.root} subheader={<li />}>
                <ListSubheader className={classes.textColor} color="default">{props.name}</ListSubheader>
                <ul className={classes.ul}>
                    <ListItem key={"list-notfound-" + props.name}>
                        <ListItemText
                            primary={""}
                            secondary={"Could not find anything"}
                        />
                    </ListItem>
                </ul>
            </List>
        )
    for (var val in props.items) {
        if (props.items[val].artist)
            items.push(
                <ListItem key={"track-" + props.items[val].id}>
                    <ListItemText
                        primary={props.items[val].name}
                        secondary={props.items[val].artist}
                    />
                </ListItem>
            );
        else if (props.items[val].id)
            items.push(
                <ListItem key={"artist-" + props.items[val].id}>
                    <ListItemText
                        primary={props.items[val].name}
                    />
                </ListItem>
            );
        else if (props.items[val].name)
            items.push(
                <ListItem key={`genre-` + props.items[val].name}>
                    <ListItemText
                        primary={props.items[val].name}
                    />
                </ListItem>
            );
        else
            items.push(
                <ListItem key={`genre-` + props.items[val]}>
                    <ListItemText
                        primary={props.items[val]}
                    />
                </ListItem>
            );
    }
    return (
        <List className={classes.root} subheader={<li />}>
            <ListSubheader className={classes.textColor}>{props.name}</ListSubheader>
            <ul className={classes.ul}>
                {items}
            </ul>
        </List>
    );
}
