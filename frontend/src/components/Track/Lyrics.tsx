import React from 'react';
import {
    Card, CardContent, Typography, makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
    lyrics: {
        whiteSpace: 'pre-wrap',
    },
}));

export default function Lyrics(props: {
    lyrics: string
}) {
    const classes = useStyles();
    const { lyrics } = props;
    return (
        <>
            <Typography>
                Lyrics
            </Typography>
            <Card>
                <CardContent>
                    <Typography className={classes.lyrics}>
                        {lyrics}
                    </Typography>
                </CardContent>
            </Card>
        </>
    );
}
