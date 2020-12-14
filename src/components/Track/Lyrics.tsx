import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    lyrics: {
        whiteSpace: "pre-wrap",
    },
}));

export default function Lyrics(props:{
    lyrics: string
}){
    const classes = useStyles();

    return (
        <div>
        <Typography>
            Lyrics
        </Typography>
        <Card>
            <CardContent>
                <Typography className={classes.lyrics}>
                    {props.lyrics}
                </Typography>
            </CardContent>
        </Card>
        </div>
    )
}