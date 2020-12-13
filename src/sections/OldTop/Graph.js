import React from 'react';
import Paper from '@material-ui/core/Paper';
import {
    ArgumentAxis,
    ValueAxis,
    Chart,
    Legend,
    Tooltip,
    ZoomAndPan,
    SplineSeries,
} from '@devexpress/dx-react-chart-material-ui';

import { EventTracker } from '@devexpress/dx-react-chart';

export default function Graph(props) {
    let zoom = null;
    if (props.zoom === true) {
        zoom = <ZoomAndPan />;
    }
    return (<Paper>
        <Chart
            data={props.data}
        >

            <ArgumentAxis />
            <ValueAxis />

            <SplineSeries name={props.name} valueField="value" argumentField="argument" />
            <Legend />
            <EventTracker />
            <Tooltip />
            {zoom}
        </Chart>
    </Paper>)
}