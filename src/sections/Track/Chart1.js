import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {
  ArgumentAxis,
  ValueAxis,
  Chart,
  LineSeries,
} from '@devexpress/dx-react-chart-material-ui';

export default function Chart1(props){
    if(props.data === undefined)
        return null;
    let data = [];
    for (let i in props.data) {
        data.push({ lineValue: props.data[i], argument: i });
    }

    return (<div>
    <Typography>
        Loudness
    </Typography>
    <Paper>
    <Chart
        data={data}
        height={150}
    >
        <ArgumentAxis 
            showLabels={false}
        />
        <ValueAxis 
            tickSize={10}
        />

        <LineSeries valueField="lineValue" argumentField="argument" />
    </Chart>
    </Paper>
    </div>
    )
}