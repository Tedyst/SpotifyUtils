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
import { Trans } from 'react-i18next';

function LineGraph(props: {
    data: any,
    zoom?: boolean,
    argument?: boolean,
    isDates?: boolean,
}) {
    const {
        data, zoom, argument, isDates,
    } = props;
    const zoomComponent = zoom === true ? <ZoomAndPan /> : null;
    const argumentComponent = argument === true ? <ArgumentAxis /> : null;
    // const asd = () => (
    //     <div style={{ backgroundColor: 'red', padding: '-4px -8px' }}>
    //         <Container maxWidth="xs" style={{ width: '100%', padding: 0}}>
    //             <SongCardRight
    //                 artist="asd"
    //                 image="https://i.scdn.co/image/ab67616d0000b273309b0cb81728d42a6dfb2b81"
    //                 name="ASD"
    //                 shadow={false}
    //                 text="The most popular song"
    //             />
    //         </Container>
    //     </div>
    // );
    const tooltipHover = (selected: Tooltip.ContentProps) => (isDates ? (
        <Trans
            i18nKey="COMMON.ON_DATE_YOU_LISTENED_TIMES"
            values={{ date: data[selected?.targetItem?.point]?.argument, times: selected?.text }}
            components={{ bold: <b /> }}
        >
            {'On <bold>{{date}}</bold>, you listened to <bold>{{times}}</bold> songs'}
        </Trans>
    ) : <div>{selected?.text}</div>
    );
    return (
        <Chart
            data={data}
            height={250}
        >

            {argumentComponent}
            <ValueAxis />

            <SplineSeries argumentField="argument" valueField="value" />
            <EventTracker />
            <Tooltip contentComponent={tooltipHover} />
            {zoomComponent}
        </Chart>
    );
}

LineGraph.defaultProps = {
    argument: false,
    zoom: false,
    isDates: false,
};

export default LineGraph;
