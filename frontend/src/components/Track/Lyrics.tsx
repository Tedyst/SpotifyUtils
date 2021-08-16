import React from 'react';
import {
    Card, CardContent, Typography, makeStyles,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();
    return (
        <>
            <Typography>
                {t('TRACK.LYRICS')}
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
