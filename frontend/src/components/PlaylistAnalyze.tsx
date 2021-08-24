import React from 'react';
import { Container, Typography } from '@material-ui/core';
import { Trans, useTranslation } from 'react-i18next';
import { Analyze } from '../views/PlaylistView';
import BarGraph from './BarGraph';
import SongCardRight from './SongCardRight';
import SongCardLeft from './SongCardLeft';

function PlaylistAnalyze(props: {
    analyze: Analyze | undefined;
}) {
    const { analyze } = props;
    const { t } = useTranslation();
    if (analyze === undefined) {
        return null;
    }
    const components = {
        acousticness: (
            <Container maxWidth="xs" style={{ width: '100%', padding: 0 }}>
                <Typography variant="subtitle1" gutterBottom align="center">
                    <Trans
                        i18nKey="COMMON.PERCENT"
                        values={{ percent: analyze.Acousticness.Median * 100 }}
                        components={{ bold: <b /> }}
                    >
                        {'<bold>{{percent}}%</bold>'}
                    </Trans>
                </Typography>
                <SongCardRight
                    artist={analyze.Acousticness.Highest.Track.Artist}
                    name={analyze.Acousticness.Highest.Track.Name}
                    image={analyze.Acousticness.Highest.Track.Image}
                    text={(
                        <>
                            {t('PLAYLIST.THE_MOST_ACOUSTIC_SONG')}
                            <br />
                            <Trans
                                i18nKey="COMMON.PERCENT"
                                values={{ percent: analyze.Acousticness.Highest.Value * 100 }}
                                components={{ bold: <b /> }}
                            />
                        </>
                    )}
                    noShadow
                />
                <div style={{ height: '4px' }} />
                <SongCardLeft
                    artist={analyze.Acousticness.Lowest.Track.Artist}
                    name={analyze.Acousticness.Lowest.Track.Name}
                    image={analyze.Acousticness.Lowest.Track.Image}
                    text={(
                        <>
                            {t('PLAYLIST.THE_LEAST_ACOUSTIC_SONG')}
                            <br />
                            <Trans
                                i18nKey="COMMON.PERCENT"
                                values={{ percent: analyze.Acousticness.Highest.Value * 100 }}
                                components={{ bold: <b /> }}
                            />
                        </>
                    )}
                    noShadow
                />
            </Container>
        ),
        energy: (
            <Container maxWidth="xs" style={{ width: '100%', padding: 0 }}>
                <Typography variant="subtitle1" gutterBottom align="center">
                    <Trans
                        i18nKey="COMMON.PERCENT"
                        values={{ percent: analyze.Energy.Median * 100 }}
                        components={{ bold: <b /> }}
                    >
                        {'<bold>{{percent}}%</bold>'}
                    </Trans>
                </Typography>
                <SongCardRight
                    artist={analyze.Energy.Highest.Track.Artist}
                    name={analyze.Energy.Highest.Track.Name}
                    image={analyze.Energy.Highest.Track.Image}
                    text={(
                        <>
                            {t('PLAYLIST.THE_MOST_ENERGETIC_SONG')}
                            <br />
                            <Trans
                                i18nKey="COMMON.PERCENT"
                                values={{ percent: analyze.Energy.Highest.Value * 100 }}
                                components={{ bold: <b /> }}
                            />
                        </>
                    )}
                    noShadow
                />
                <div style={{ height: '4px' }} />
                <SongCardLeft
                    artist={analyze.Energy.Lowest.Track.Artist}
                    name={analyze.Energy.Lowest.Track.Name}
                    image={analyze.Energy.Lowest.Track.Image}
                    text={(
                        <>
                            {t('PLAYLIST.THE_LEAST_ENERGETIC_SONG')}
                            <br />
                            <Trans
                                i18nKey="COMMON.PERCENT"
                                values={{ percent: analyze.Energy.Lowest.Value * 100 }}
                                components={{ bold: <b /> }}
                            />
                        </>
                    )}
                    noShadow
                />
            </Container>
        ),
        instrumentalness: (
            <Container maxWidth="xs" style={{ width: '100%', padding: 0 }}>
                <Typography variant="subtitle1" gutterBottom align="center">
                    <Trans
                        i18nKey="COMMON.PERCENT"
                        values={{ percent: analyze.Instrumentalness.Median * 100 }}
                        components={{ bold: <b /> }}
                    >
                        {'<bold>{{percent}}%</bold>'}
                    </Trans>
                </Typography>
                <SongCardRight
                    artist={analyze.Instrumentalness.Highest.Track.Artist}
                    name={analyze.Instrumentalness.Highest.Track.Name}
                    image={analyze.Instrumentalness.Highest.Track.Image}
                    text={(
                        <>
                            {t('PLAYLIST.THE_MOST_INSTRUMENTAL_SONG')}
                            <br />
                            <Trans
                                i18nKey="COMMON.PERCENT"
                                values={{ percent: analyze.Instrumentalness.Highest.Value * 100 }}
                                components={{ bold: <b /> }}
                            />
                        </>
                    )}
                    noShadow
                />
                <div style={{ height: '4px' }} />
                <SongCardLeft
                    artist={analyze.Instrumentalness.Lowest.Track.Artist}
                    name={analyze.Instrumentalness.Lowest.Track.Name}
                    image={analyze.Instrumentalness.Lowest.Track.Image}
                    text={(
                        <>
                            {t('PLAYLIST.THE_LEAST_INSTRUMENTAL_SONG')}
                            <br />
                            <Trans
                                i18nKey="COMMON.PERCENT"
                                values={{ percent: analyze.Instrumentalness.Lowest.Value * 100 }}
                                components={{ bold: <b /> }}
                            />
                        </>
                    )}
                    noShadow
                />
            </Container>
        ),
        tempo: (
            <Container maxWidth="xs" style={{ width: '100%', padding: 0 }}>
                <Typography variant="subtitle1" gutterBottom align="center">
                    <Trans
                        i18nKey="COMMON.NUMBER"
                        values={{ number: analyze.Tempo.Median }}
                        components={{ bold: <b /> }}
                    />
                </Typography>
                <SongCardRight
                    artist={analyze.Tempo.Highest.Track.Artist}
                    name={analyze.Tempo.Highest.Track.Name}
                    image={analyze.Tempo.Highest.Track.Image}
                    text={(
                        <>
                            {t('PLAYLIST.THE_HIGHEST_TEMPO_SONG')}
                            <br />
                            <Trans
                                i18nKey="COMMON.NUMBER"
                                values={{ number: analyze.Tempo.Highest.Value }}
                                components={{ bold: <b /> }}
                            />
                        </>
                    )}
                    noShadow
                />
                <div style={{ height: '4px' }} />
                <SongCardLeft
                    artist={analyze.Tempo.Lowest.Track.Artist}
                    name={analyze.Tempo.Lowest.Track.Name}
                    image={analyze.Tempo.Lowest.Track.Image}
                    text={(
                        <>
                            {t('PLAYLIST.THE_LOWEST_TEMPO_SONG')}
                            <br />
                            <Trans
                                i18nKey="COMMON.NUMBER"
                                values={{ number: analyze.Tempo.Lowest.Value }}
                                components={{ bold: <b /> }}
                            />
                        </>
                    )}
                    noShadow
                />
            </Container>
        ),
    };

    return (
        <>
            <Container maxWidth="sm">
                <BarGraph
                    acousticness={analyze.Acousticness.Median}
                    instrumentalness={analyze.Instrumentalness.Median}
                    energy={analyze.Energy.Median}
                    tempo={analyze.Tempo.Median}
                    track={false}
                    tooltipComponents={components}
                />
            </Container>
        </>
    );
}

export default PlaylistAnalyze;
