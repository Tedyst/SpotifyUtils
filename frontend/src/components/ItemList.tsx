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
    if (!items || items.length === 0 || !items) {
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
        if (item.Artist) {
            it.push(
                <ListItem key={`track-${item.ID}`}>
                    <ListItemText
                        primary={item.Name}
                        secondary={item.Artist}
                    />
                </ListItem>,
            );
        } else if (item.ID) {
            it.push(
                <ListItem key={`artist-${item.ID}`}>
                    <ListItemText
                        primary={item.Name}
                    />
                </ListItem>,
            );
        } else if (item.Name) {
            it.push(
                <ListItem key={`genre-${item.Name}`}>
                    <ListItemText
                        primary={item.Name}
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
