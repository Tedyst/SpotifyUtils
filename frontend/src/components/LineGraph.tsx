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

function LineGraph(props: {
    data: any,
    zoom?: boolean,
    argument?: boolean
}) {
    const { data, zoom, argument } = props;
    const zoomComponent = zoom === true ? <ZoomAndPan /> : null;
    const argumentComponent = argument === true ? <ArgumentAxis /> : null;
    return (
        <Chart
            data={data}
            height={250}
        >

            {argumentComponent}
            <ValueAxis />

            <SplineSeries argumentField="argument" valueField="value" />
            <EventTracker />
            <Tooltip>
                asd
            </Tooltip>
            {zoomComponent}
        </Chart>
    );
}

LineGraph.defaultProps = {
    argument: false,
    zoom: false,
};

export default LineGraph;
