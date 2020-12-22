import React from 'react';
import { Card, CardContent, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    lyrics: {
        whiteSpace: "pre-wrap",
    },
}));

export default function Lyrics(props: {
    lyrics: string
}) {
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