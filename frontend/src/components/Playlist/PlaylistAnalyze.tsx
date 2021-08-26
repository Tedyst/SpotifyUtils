/* eslint-disable max-len */
import React from 'react';
import { Container, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Analyze } from '../../views/PlaylistView';
import BarGraph from '../Graphs/BarGraph';
import PieChart from '../Graphs/PieGraph';
import Tooltip from './Tooltip';

function PlaylistAnalyze(props: {
    analyze: Analyze | undefined;
}) {
    const { analyze } = props;
    const { t } = useTranslation();
    if (analyze === undefined) {
        return null;
    }

    const barGraphComponents = {
        acousticness: (
            <Tooltip
                data={analyze?.Acousticness}
                highestText={t('PLAYLIST.THE_MOST_ACOUSTIC_SONG')}
                lowestText={t('PLAYLIST.THE_LEAST_ACOUSTIC_SONG')}
                percent
            />),
        energy: (
            <Tooltip
                data={analyze?.Energy}
                highestText={t('PLAYLIST.THE_MOST_ENERGETIC_SONG')}
                lowestText={t('PLAYLIST.THE_LEAST_ENERGETIC_SONG')}
                percent
            />),
        instrumentalness: (
            <Tooltip
                data={analyze?.Instrumentalness}
                highestText={t('PLAYLIST.THE_MOST_INSTRUMENTAL_SONG')}
                lowestText={t('PLAYLIST.THE_LEAST_INSTRUMENTAL_SONG')}
                percent
            />),
        tempo: (
            <Tooltip
                data={analyze?.Tempo}
                highestText={t('PLAYLIST.THE_HIGHEST_TEMPO_SONG')}
                lowestText={t('PLAYLIST.THE_LOWEST_TEMPO_SONG')}
            />),
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
