import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  selectTop,
  setTop
} from '../store/user';
import { useSelector, useDispatch } from 'react-redux';
import Container from '@material-ui/core/Container';
import { Grid } from '@material-ui/core';
import ArtistCard from '../sections/Top/ArtistCard';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1
    }
}));


export default function Top(){
    const top = useSelector(selectTop);
    const classes = useStyles();
    const [Updating, setUpdating] = useState(false);
    const dispatch = useDispatch();
    if(Object.keys(top["artists"]).length === 0 && Updating === false){
        setUpdating(true);
        fetch('/top/me').then(res => res.json()).then(data => {
            dispatch(setTop(data));
        });
    }
    console.log(top);
    let items = [];
    for(var val in top["artists"]){
        console.log(top["artists"][val])
        items.push(<Grid item key={top["artists"][val].id}>
            <ArtistCard
                key={top["artists"][val].id}
                name={top["artists"][val].name}
                image={top["artists"][val].image}
                secondary={"Test"}
                height={200}
            />
        </Grid>);
    }
    console.log(items);
    return (
        <Container maxWidth="xs">
            <Grid container xs={6} spacing={2} className={classes.root} direction="column" alignItems="stretch">
                {items}
            </Grid>
        </Container>
    )
}