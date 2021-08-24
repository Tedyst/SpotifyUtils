import React from 'react';
import {
    Paper,
    Typography,
    useMediaQuery,
    useTheme,
} from '@material-ui/core';
import {
    BarSeries,
    ArgumentAxis,
    Chart,
    Tooltip,
} from '@devexpress/dx-react-chart-material-ui';
import { useTranslation } from 'react-i18next';
import { EventTracker } from '@devexpress/dx-react-chart';

export interface BarGraphProps {
    acousticness?: number,
    danceability?: number,
    energy?: number,
    instrumentalness?: number,
    liveness?: number,
    loudness?: number,
    speechiness?: number,
    tempo?: number,
    track?: boolean,
}
export default function BarGraph(props: BarGraphProps) {
    const {
        acousticness,
        danceability,
        energy,
        instrumentalness,
        liveness,
        loudness,
        speechiness,
        tempo,
        track,
    } = props;
    const { t } = useTranslation();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const trackFeatures = track ? (
        <Typography>
            {t('TRACK.TRACK_FEATURES')}
        </Typography>
    ) : null;
    if (matches) {
        const data1 = [
            {
                lineValue: acousticness ? acousticness * 100 : undefined,
                argument: t('TRACK.ACOUSTICNESS'),
            },
            {
                lineValue: danceability ? danceability * 100 : undefined,
                argument: t('TRACK.DANCEABILITY'),
            },
            {
                lineValue: energy ? energy * 100 : undefined,
                argument: t('TRACK.ENERGY'),
            },
            {
                lineValue: instrumentalness ? instrumentalness * 100 : undefined,
                argument: t('TRACK.INSTRUMENTALNESS'),
            },
        ];
        const data2 = [
            {
                lineValue: liveness ? liveness * 100 : undefined,
                argument: t('TRACK.LIVENESS'),
            },
            {
                lineValue: loudness ? loudness * 100 : undefined,
                argument: t('TRACK.LOUDNESS'),
            },
            {
                lineValue: speechiness ? speechiness * 100 : undefined,
                argument: t('TRACK.SPEECHINESS'),
            },
            {
                lineValue: tempo,
                argument: t('TRACK.TEMPO'),
            },
        ];
        return (
            <>
                {trackFeatures}
                <Paper>
                    <Chart
                        data={data1}
                        height={120}
                    >
                        <BarSeries
                            argumentField="argument"
                            valueField="lineValue"
                        />
                        <ArgumentAxis />
                        <EventTracker />
                        <Tooltip />
                    </Chart>
                    <br />
                    <Chart
                        data={data2}
                        height={120}
                    >
                        <BarSeries
                            argumentField="argument"
                            valueField="lineValue"
                        />
                        <ArgumentAxis />
                        <EventTracker />
                        <Tooltip />
                    </Chart>
                </Paper>
            </>
        );
    }

    const data = [
        {
            lineValue: acousticness ? acousticness * 100 : undefined,
            argument: t('TRACK.ACOUSTICNESS'),
        },
        {
            lineValue: danceability ? danceability * 100 : undefined,
            argument: t('TRACK.DANCEABILITY'),
        },
        {
            lineValue: energy ? energy * 100 : undefined,
            argument: t('TRACK.ENERGY'),
        },
        {
            lineValue: instrumentalness ? instrumentalness * 100 : undefined,
            argument: t('TRACK.INSTRUMENTALNESS'),
        },
        {
            lineValue: liveness ? liveness * 100 : undefined,
            argument: t('TRACK.LIVENESS'),
        },
        {
            lineValue: loudness ? loudness * 100 : undefined,
            argument: t('TRACK.LOUDNESS'),
        },
        {
            lineValue: speechiness ? speechiness * 100 : undefined,
            argument: t('TRACK.SPEECHINESS'),
        },
        {
            lineValue: tempo,
            argument: t('TRACK.TEMPO'),
        },
    ];

    return (
        <>
            {trackFeatures}
            <Paper>
                <Chart
                    data={data}
                    height={120}
                >
                    <BarSeries
                        argumentField="argument"
                        valueField="lineValue"
                    />
                    <ArgumentAxis />
                    <EventTracker />
                    <Tooltip />
                </Chart>
            </Paper>
        </>
    );
}

BarGraph.defaultProps = {
    acousticness: undefined,
    danceability: undefined,
    energy: undefined,
    instrumentalness: undefined,
    liveness: undefined,
    loudness: undefined,
    speechiness: undefined,
    tempo: undefined,
    track: true,
};
