import React from 'react';
import Paper from '@material-ui/core/Paper';
import {
    ArgumentAxis,
    ValueAxis,
    Chart,
    Tooltip,
    ZoomAndPan,
    SplineSeries,
} from '@devexpress/dx-react-chart-material-ui';

import { EventTracker } from '@devexpress/dx-react-chart';

export default function Graph(props:{
    data: any,
    zoom?: boolean,
}) {
    let zoom = null;
    if (props.zoom === true) {
        zoom = <ZoomAndPan />;
    }
    return (<Paper>
        <Chart height={250}
            data={props.data}
        >

            <ArgumentAxis />
            <ValueAxis />

            <SplineSeries valueField="value" argumentField="argument" />
            <EventTracker />
            <Tooltip />
            {zoom}
        </Chart>
    </Paper>)
}