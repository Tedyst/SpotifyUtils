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

function Graph(props: {
    data: any,
    zoom?: boolean,
    argument?: boolean
}) {
    const { data, zoom, argument } = props;
    const zoomComponent = zoom === true ? <ZoomAndPan /> : null;
    const argumentComponent = argument === true ? <ArgumentAxis /> : null;
    return (
        <Chart
            height={250}
            data={data}
        >

            {argumentComponent}
            <ValueAxis />

            <SplineSeries valueField="value" argumentField="argument" />
            <EventTracker />
            <Tooltip />
            {zoomComponent}
        </Chart>
    );
}

Graph.defaultProps = {
    zoom: false,
    argument: false,
};

export default Graph;
