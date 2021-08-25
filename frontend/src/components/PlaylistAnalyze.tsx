/* eslint-disable max-len */
import React from 'react';
import { Container, Typography } from '@material-ui/core';
import { Trans, useTranslation } from 'react-i18next';
import { Analyze, Track } from '../views/PlaylistView';
import BarGraph from './BarGraph';
import SongCardRight from './SongCardRight';
import SongCardLeft from './SongCardLeft';
import PieChart from './PieGraph';

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

interface dataStruct {
    data: medianStruct;
    highestText: string;
    lowestText: string;
    percent: boolean;
}

function PlaylistAnalyze(props: {
    analyze: Analyze | undefined;
}) {
    const { analyze } = props;
    const { t } = useTranslation();
    if (analyze === undefined) {
        return null;
    }
    const templ = (data: dataStruct) => {
        if (!data) return null;
        if (data.percent) {
            return (
                <Container maxWidth="xs" style={{ width: '100%', padding: 0 }}>
                    <Typography variant="subtitle1" gutterBottom align="center">
                        <Trans
                            i18nKey="COMMON.PERCENT"
                            values={{ percent: (data?.data?.Median * 100).toFixed(2) }}
                            components={{ bold: <b /> }}
                        >
                            {'<bold>{{percent}}%</bold>'}
                        </Trans>
                    </Typography>
                    <SongCardRight
                        artist={data.data?.Highest?.Track?.Artist}
                        name={data.data?.Highest?.Track?.Name}
                        image={data.data?.Highest?.Track?.Image}
                        text={(
                            <>
                                {data.highestText}
                                <br />
                                <Trans
                                    i18nKey="COMMON.PERCENT"
                                    values={{ percent: (data.data?.Highest?.Value * 100).toFixed(2) }}
                                    components={{ bold: <b /> }}
                                />
                            </>
                        )}
                        noShadow
                    />
                    <div style={{ height: '4px' }} />
                    <SongCardLeft
                        artist={data.data?.Lowest?.Track?.Artist}
                        name={data.data?.Lowest?.Track?.Name}
                        image={data.data?.Lowest?.Track?.Image}
                        text={(
                            <>
                                {data.lowestText}
                                <br />
                                <Trans
                                    i18nKey="COMMON.PERCENT"
                                    values={{ percent: (data.data?.Lowest?.Value * 100).toFixed(2) }}
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
                        values={{ number: data?.data?.Median }}
                        components={{ bold: <b /> }}
                    />
                </Typography>
                <SongCardRight
                    artist={data.data?.Highest?.Track?.Artist}
                    name={data.data?.Highest?.Track?.Name}
                    image={data.data?.Highest?.Track?.Image}
                    text={(
                        <>
                            {data.highestText}
                            <br />
                            <Trans
                                i18nKey="COMMON.NUMBER"
                                values={{ number: data.data?.Highest?.Value }}
                                components={{ bold: <b /> }}
                            />
                        </>
                    )}
                    noShadow
                />
                <div style={{ height: '4px' }} />
                <SongCardLeft
                    artist={data.data?.Lowest?.Track?.Artist}
                    name={data.data?.Lowest?.Track?.Name}
                    image={data.data?.Lowest?.Track?.Image}
                    text={(
                        <>
                            {data.lowestText}
                            <br />
                            <Trans
                                i18nKey="COMMON.NUMBER"
                                values={{ number: data.data?.Lowest?.Value }}
                                components={{ bold: <b /> }}
                            />
                        </>
                    )}
                    noShadow
                />
            </Container>
        );
    };

    const barGraphComponents = {
        acousticness: templ({
            data: analyze?.Acousticness,
            highestText: t('PLAYLIST.THE_MOST_ACOUSTIC_SONG'),
            lowestText: t('PLAYLIST.THE_LEAST_ACOUSTIC_SONG'),
            percent: true,
        }),
        energy: templ({
            data: analyze?.Energy,
            highestText: t('PLAYLIST.THE_MOST_ENERGETIC_SONG'),
            lowestText: t('PLAYLIST.THE_LEAST_ENERGETIC_SONG'),
            percent: true,
        }),
        instrumentalness: templ({
            data: analyze?.Instrumentalness,
            highestText: t('PLAYLIST.THE_MOST_INSTRUMENTAL_SONG'),
            lowestText: t('PLAYLIST.THE_LEAST_INSTRUMENTAL_SONG'),
            percent: true,
        }),
        tempo: templ({
            data: analyze?.Tempo,
            highestText: t('PLAYLIST.THE_HIGHEST_TEMPO_SONG'),
            lowestText: t('PLAYLIST.THE_LOWEST_TEMPO_SONG'),
            percent: false,
        }),
    };

    return (
        <>
            <Container maxWidth="sm">
                <PieChart
                    data={analyze?.Artists}
                    text={(
                        <Typography variant="h6" gutterBottom align="center">
                            {t('PLAYLIST.ARTISTS_FROM_PLAYLIST')}
                        </Typography>
                    )}
                />
                <br />
                <BarGraph
                    acousticness={analyze?.Acousticness?.Median}
                    instrumentalness={analyze?.Instrumentalness?.Median}
                    energy={analyze?.Energy?.Median}
                    tempo={analyze?.Tempo?.Median}
                    track={false}
                    tooltipComponents={barGraphComponents}
                />
            </Container>
        </>
    );
}

export default PlaylistAnalyze;
