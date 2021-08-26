/* eslint-disable max-len */
import React from 'react';
import { Container, Typography } from '@material-ui/core';
import { Trans } from 'react-i18next';
import { Track } from '../../views/PlaylistView';
import SongCard from '../Cards/SongCard';

interface medianStruct {
    Highest: {
        Track: Track;
        Value: number;
    },
    Lowest: {
        Track: Track;
        Value: number;
    },
    Median: number;
}

export interface TooltipProps {
    data: medianStruct;
    highestText: string;
    lowestText: string;
    percent?: boolean;
}

export default function Tooltip(props: TooltipProps) {
    const {
        data,
        highestText,
        lowestText,
        percent,
    } = props;
    if (percent) {
        return (
            <Container maxWidth="xs" style={{ width: '100%', padding: 0 }}>
                <Typography variant="subtitle1" gutterBottom align="center">
                    <Trans
                        i18nKey="COMMON.PERCENT"
                        values={{ percent: (data?.Median * 100).toFixed(2) }}
                        components={{ bold: <b /> }}
                    >
                        {'<bold>{{percent}}%</bold>'}
                    </Trans>
                </Typography>
                <SongCard
                    type="right"
                    artist={data?.Highest?.Track?.Artist}
                    name={data?.Highest?.Track?.Name}
                    image={data?.Highest?.Track?.Image}
                    text={(
                        <>
                            {highestText}
                            <br />
                            <Trans
                                i18nKey="COMMON.PERCENT"
                                values={{ percent: (data?.Highest?.Value * 100).toFixed(2) }}
                                components={{ bold: <b /> }}
                            />
                        </>
                    )}
                    noShadow
                />
                <div style={{ height: '4px' }} />
                <SongCard
                    type="left"
                    artist={data?.Lowest?.Track?.Artist}
                    name={data?.Lowest?.Track?.Name}
                    image={data?.Lowest?.Track?.Image}
                    text={(
                        <>
                            {lowestText}
                            <br />
                            <Trans
                                i18nKey="COMMON.PERCENT"
                                values={{ percent: (data?.Lowest?.Value * 100).toFixed(2) }}
                                components={{ bold: <b /> }}
                            />
                        </>
                    )}
                    noShadow
                />
            </Container>
        );
    }

    return (
        <Container maxWidth="xs" style={{ width: '100%', padding: 0 }}>
            <Typography variant="subtitle1" gutterBottom align="center">
                <Trans
                    i18nKey="COMMON.NUMBER"
                    values={{ number: data?.Median }}
                    components={{ bold: <b /> }}
                />
            </Typography>
            <SongCard
                type="right"
                artist={data?.Highest?.Track?.Artist}
                name={data?.Highest?.Track?.Name}
                image={data?.Highest?.Track?.Image}
                text={(
                    <>
                        {highestText}
                        <br />
                        <Trans
                            i18nKey="COMMON.NUMBER"
                            values={{ number: data?.Highest?.Value }}
                            components={{ bold: <b /> }}
                        />
                    </>
                )}
                noShadow
            />
            <div style={{ height: '4px' }} />
            <SongCard
                type="left"
                artist={data?.Lowest?.Track?.Artist}
                name={data?.Lowest?.Track?.Name}
                image={data?.Lowest?.Track?.Image}
                text={(
                    <>
                        {lowestText}
                        <br />
                        <Trans
                            i18nKey="COMMON.NUMBER"
                            values={{ number: data?.Lowest?.Value }}
                            components={{ bold: <b /> }}
                        />
                    </>
                )}
                noShadow
            />
        </Container>
    );
}

Tooltip.defaultProps = {
    percent: false,
};
