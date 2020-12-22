import React from 'react';
import {
    ArgumentAxis,
    ValueAxis,
    Chart,
    Tooltip,
    ZoomAndPan,
    SplineSeries,
} from '@devexpress/dx-react-chart-material-ui';

import { EventTracker } from '@devexpress/dx-react-chart';

export default function Graph(props: {
    data: any,
    zoom?: boolean,
    argument?: boolean
}) {
    let zoom = null;
    if (props.zoom === true) {
        zoom = <ZoomAndPan />;
    }
    let argument = null;
    if (props.argument === true) {
        argument = <ArgumentAxis />
    }
    return (<Chart height={250}
        data={props.data}
    >

        {argument}
        <ValueAxis />

        <SplineSeries valueField="value" argumentField="argument" />
        <EventTracker />
        <Tooltip />
        {zoom}
    </Chart>
    )
}