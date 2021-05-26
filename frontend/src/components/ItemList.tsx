import React from 'react';
import {
    makeStyles, List, ListItem, ListItemText, ListSubheader,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        position: 'relative',
        overflow: 'auto',
        maxHeight: 400,
        'color-scheme': 'dark',
    },
    listSection: {
        backgroundColor: 'inherit',
    },
    ul: {
        backgroundColor: 'inherit',
        padding: 0,
    },
    textColor: {
        color: theme.palette.info.light,
    },
}));

export default function ListItems(props: {
    items: any[] | null,
    name: string
}) {
    const classes = useStyles();
    const { items, name } = props;
    const it: any[] = [];
    if (items === null || items.length === 0 || !items) {
        return (
            <List className={classes.root} subheader={<li />}>
                <ListSubheader className={classes.textColor} color="default">
                    {name}
                </ListSubheader>
                <ul className={classes.ul}>
                    <ListItem key={`list-notfound-${name}`}>
                        <ListItemText
                            primary=""
                            secondary="Could not find anything"
                        />
                    </ListItem>
                </ul>
            </List>
        );
    }
    Object.values(items).forEach((item) => {
        if (item.artist) {
            it.push(
                <ListItem key={`track-${item.id}`}>
                    <ListItemText
                        primary={item.name}
                        secondary={item.artist}
                    />
                </ListItem>,
            );
        } else if (item.id) {
            it.push(
                <ListItem key={`artist-${item.id}`}>
                    <ListItemText
                        primary={item.name}
                    />
                </ListItem>,
            );
        } else if (item.name) {
            it.push(
                <ListItem key={`genre-${item.name}`}>
                    <ListItemText
                        primary={item.name}
                    />
                </ListItem>,
            );
        } else {
            it.push(
                <ListItem key={`genre-${item}`}>
                    <ListItemText
                        primary={item}
                    />
                </ListItem>,
            );
        }
    });

    return (
        <List className={classes.root} subheader={<li />}>
            <ListSubheader className={classes.textColor}>
                {name}
            </ListSubheader>
            <ul className={classes.ul}>
                {it}
            </ul>
        </List>
    );
}
