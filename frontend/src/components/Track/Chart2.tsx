import React from 'react';
import { Paper, Typography } from '@material-ui/core';
import {
    BarSeries,
    ArgumentAxis,
    Chart,
} from '@devexpress/dx-react-chart-material-ui';
import { useTranslation } from 'react-i18next';

export default function Chart2(props: {
    acousticness: number,
    danceability: number,
    energy: number,
    instrumentalness: number,
    liveness: number,
    loudness: number,
    speechiness: number,
}) {
    const {
        acousticness,
        danceability,
        energy,
        instrumentalness,
        liveness,
        loudness,
        speechiness,
    } = props;
    const { t } = useTranslation();
    const data = [
        {
            lineValue: acousticness,
            argument: t('TRACK.ACOUSTICNESS'),
        },
        {
            lineValue: danceability,
            argument: t('TRACK.DANCEABILITY'),
        },
        {
            lineValue: energy,
            argument: t('TRACK.ENERGY'),
        },
        {
            lineValue: instrumentalness,
            argument: t('TRACK.INSTRUMENTALNESS'),
        },
        {
            lineValue: liveness,
            argument: t('TRACK.LIVENESS'),
        },
        {
            lineValue: loudness,
            argument: t('TRACK.LOUDNESS'),
        },
        {
            lineValue: speechiness,
            argument: t('TRACK.SPEECHINESS'),
        },
    ];

    return (
        <>
            <Typography>
                {t('TRACK.TRACK_FEATURES')}
            </Typography>
            <Paper>
                <Chart
                    data={data}
                    height={120}
                >
                    <BarSeries
                        argumentField="argument"
                        valueField="lineValue"
                    />
                    <ArgumentAxis />
                </Chart>
            </Paper>
        </>
    );
}
