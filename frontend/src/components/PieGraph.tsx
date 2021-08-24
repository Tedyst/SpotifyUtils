import React from 'react';
import { Paper } from '@material-ui/core';
import {
    Chart,
    PieSeries,
    Tooltip,
} from '@devexpress/dx-react-chart-material-ui';

import { EventTracker } from '@devexpress/dx-react-chart';

export default function PieChart(props: {
    data: { [key: string]: number },
    text?: string | React.ReactNode,
}) {
    const { data, text } = props;
    if (data === undefined) return null;
    const points: { lineValue: number, argument: string }[] = [];
    Object.keys(data).forEach((key) => {
        points.push({ lineValue: data[key], argument: key });
    });
    const tooltipHover = (selected: Tooltip.ContentProps) => (
        <>
            {`${points[selected?.targetItem?.point]?.argument} - ${selected?.text}`}
        </>
    );

    return (
        <>
            <Paper>
                {text}
                <Chart
                    data={points}
                    height={300}
                >
                    <PieSeries
                        valueField="lineValue"
                        argumentField="argument"
                    />
                    <EventTracker />
                    <Tooltip contentComponent={tooltipHover} />
                </Chart>
            </Paper>
        </>
    );
}

PieChart.defaultProps = {
    text: undefined,
};
