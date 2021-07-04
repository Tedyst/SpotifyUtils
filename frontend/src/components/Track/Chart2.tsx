import React from 'react';
import { Paper, Typography } from '@material-ui/core';
import {
    BarSeries,
    ArgumentAxis,
    Chart,
} from '@devexpress/dx-react-chart-material-ui';

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
    const data = [
        {
            lineValue: acousticness,
            argument: 'Acousticness',
        },
        {
            lineValue: danceability,
            argument: 'Danceability',
        },
        {
            lineValue: energy,
            argument: 'Energy',
        },
        {
            lineValue: instrumentalness,
            argument: 'Instrumentalness',
        },
        {
            lineValue: liveness,
            argument: 'Liveness',
        },
        {
            lineValue: loudness,
            argument: 'Loudness',
        },
        {
            lineValue: speechiness,
            argument: 'Speechiness',
        },
    ];

    return (
        <>
            <Typography>
                Track Features
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
