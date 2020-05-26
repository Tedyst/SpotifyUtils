import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';

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
}));

export default function ListItems(props) {
    const classes = useStyles();

    if(props.items.length === 0 || !props.items)
        return null;
    let items = [];
    console.log(props.items)
    for(var val in props.items){
        if(props.items[val].artist)
            items.push(
                <ListItem key={props.items[val].id}>
                    <ListItemText
                        primary={props.items[val].name}
                        secondary={props.items[val].artist}
                    />
                </ListItem>
            );
        else if(props.items[val].name)
            items.push(
                <ListItem key={props.items[val].id}>
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
            <ul className={classes.ul}>
                {items}
            </ul>
        </List>
    );
}
