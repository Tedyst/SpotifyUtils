import React from 'react';
import { Paper, Typography } from '@material-ui/core';
import {
    ArgumentAxis,
    ValueAxis,
    Chart,
    LineSeries,
} from '@devexpress/dx-react-chart-material-ui';

export default function Chart1(props: {
    data: any,
}) {
    const { data } = props;
    if (data === undefined) return null;
    const points = [];
    Object.keys(data).forEach((key) => {
        points.push({ lineValue: data[key], argument: key });
    });

    return (
        <>
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

                    <LineSeries argumentField="argument" valueField="lineValue" />
                </Chart>
            </Paper>
        </>
    );
}
