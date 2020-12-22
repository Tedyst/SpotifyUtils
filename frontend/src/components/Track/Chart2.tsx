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
    let data = [
        {
            lineValue: props.acousticness,
            argument: "Acousticness"
        },
        {
            lineValue: props.danceability,
            argument: "Danceability"
        },
        {
            lineValue: props.energy,
            argument: "Energy"
        },
        {
            lineValue: props.instrumentalness,
            argument: "Instrumentalness"
        },
        {
            lineValue: props.liveness,
            argument: "Liveness"
        },
        {
            lineValue: props.loudness,
            argument: "Loudness"
        },
        {
            lineValue: props.speechiness,
            argument: "Speechiness"
        },
    ];

    return (<div>
        <Typography>
            Track Features
    </Typography>
        <Paper>
            <Chart
                data={data}
                height={120}
            >
                <BarSeries valueField="lineValue" argumentField="argument"
                />
                <ArgumentAxis />
            </Chart>
        </Paper>
    </div>
    )
}