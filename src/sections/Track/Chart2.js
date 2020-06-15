import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {
  BarSeries,
  ArgumentAxis,
  Chart,
} from '@devexpress/dx-react-chart-material-ui';

export default function Chart2(props){
    let data = [
        {
            lineValue: props.acousticness,
            argument: "Acousticness"
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
        Loudness
    </Typography>
    <Paper>
    <Chart
        data={data}
        height="120"
    >
        <BarSeries valueField="lineValue" argumentField="argument"
        />
        <ArgumentAxis />
    </Chart>
    </Paper>
    </div>
    )
}