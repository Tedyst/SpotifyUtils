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
    title?: string,
    tooltipComponents?: {
        acousticness?: React.ReactNode,
        danceability?: React.ReactNode,
        energy?: React.ReactNode,
        instrumentalness?: React.ReactNode,
        liveness?: React.ReactNode,
        loudness?: React.ReactNode,
        speechiness?: React.ReactNode,
        tempo?: React.ReactNode,
    },
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
        title,
        tooltipComponents,
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

        const tooltipCompSelector1 = (selected: Tooltip.ContentProps) => {
            const { point } = selected.targetItem;
            if (point === 0 && tooltipComponents?.acousticness !== undefined) {
                return <>{tooltipComponents.acousticness}</>;
            }
            if (point === 1 && tooltipComponents?.danceability !== undefined) {
                return <>{tooltipComponents.danceability}</>;
            }
            if (point === 2 && tooltipComponents?.energy !== undefined) {
                return <>{tooltipComponents.energy}</>;
            }
            if (point === 3 && tooltipComponents?.instrumentalness !== undefined) {
                return <>{tooltipComponents.instrumentalness}</>;
            }
            return (
                <>
                    {selected.text}
                </>
            );
        };

        const tooltipCompSelector2 = (selected: Tooltip.ContentProps) => {
            const { point } = selected.targetItem;
            if (point === 0 && tooltipComponents?.liveness !== undefined) {
                return <>{tooltipComponents.liveness}</>;
            }
            if (point === 1 && tooltipComponents?.loudness !== undefined) {
                return <>{tooltipComponents.loudness}</>;
            }
            if (point === 2 && tooltipComponents?.speechiness !== undefined) {
                return <>{tooltipComponents.speechiness}</>;
            }
            if (point === 3 && tooltipComponents?.tempo !== undefined) {
                return <>{tooltipComponents.tempo}</>;
            }
            return (
                <>
                    {selected.text}
                </>
            );
        };

        return (
            <>
                {trackFeatures}
                <Paper>
                    <Typography variant="h6">
                        {title}
                    </Typography>
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
                        <Tooltip contentComponent={tooltipCompSelector1} />
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
                        <Tooltip contentComponent={tooltipCompSelector2} />
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

    const tooltipCompSelector = (selected: Tooltip.ContentProps) => {
        const { point } = selected.targetItem;
        if (point === 0 && tooltipComponents?.acousticness !== undefined) {
            return <>{tooltipComponents.acousticness}</>;
        }
        if (point === 1 && tooltipComponents?.danceability !== undefined) {
            return <>{tooltipComponents.danceability}</>;
        }
        if (point === 2 && tooltipComponents?.energy !== undefined) {
            return <>{tooltipComponents.energy}</>;
        }
        if (point === 3 && tooltipComponents?.instrumentalness !== undefined) {
            return <>{tooltipComponents.instrumentalness}</>;
        }
        if (point === 4 && tooltipComponents?.liveness !== undefined) {
            return <>{tooltipComponents.liveness}</>;
        }
        if (point === 5 && tooltipComponents?.loudness !== undefined) {
            return <>{tooltipComponents.loudness}</>;
        }
        if (point === 6 && tooltipComponents?.speechiness !== undefined) {
            return <>{tooltipComponents.speechiness}</>;
        }
        if (point === 7 && tooltipComponents?.tempo !== undefined) {
            return <>{tooltipComponents.tempo}</>;
        }
        return (
            <>
                {selected.text}
            </>
        );
    };

    return (
        <>
            {trackFeatures}
            <Paper>
                <Typography variant="subtitle1" align="center">
                    {title}
                </Typography>
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
                    <Tooltip contentComponent={tooltipCompSelector} />
                </Chart>
                <Typography variant="subtitle2" align="center" color="textSecondary">
                    You can also click on the bars to see more details
                </Typography>
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
