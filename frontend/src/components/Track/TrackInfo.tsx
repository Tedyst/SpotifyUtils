import React from 'react';
import {
    Table, TableBody, TableCell, TableContainer, Typography, TableRow, Paper,
} from '@material-ui/core';
import { HumanizeDuration, HumanizeDurationLanguage } from 'humanize-duration-ts';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

function msToText(ms: number): string {
    const langService = new HumanizeDurationLanguage();
    const humanizer = new HumanizeDuration(langService);
    humanizer.setOptions({
        language: i18n.languages[0],
    });
    return humanizer.humanize(ms - (ms % 1000));
}

function keyToText(key: number) {
    if (key === -1) return 'None';
    if (key <= 1) return 'C';
    if (key <= 3) return 'D';
    if (key <= 5) return 'E';
    if (key <= 7) return 'F';
    if (key <= 8) return 'G';
    if (key <= 10) return 'A';
    if (key <= 11) return 'B';
    return 'None';
}

export default function TrackInfo(props: {
    popularity: number,
    length: number,
    markets: number,
    explicit: boolean,
    trackKey: number,
    mode: number,
    tempo: number,
    timeSignature: number
}) {
    const {
        popularity,
        length,
        markets,
        explicit,
        trackKey,
        mode,
        tempo,
        timeSignature,
    } = props;
    const { t } = useTranslation();
    return (
        <>
            <Typography>
                {t('TRACK.TRACK_INFORMATION')}
            </Typography>
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableBody>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                {t('TRACK.POPULARITY')}
                            </TableCell>
                            <TableCell align="right">
                                {popularity}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                {t('TRACK.LENGTH')}
                            </TableCell>
                            <TableCell align="right">
                                {msToText(length)}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                {t('TRACK.SPOTIFY_MARKETS')}
                            </TableCell>
                            <TableCell align="right">
                                {markets}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                {t('TRACK.EXPLICIT')}
                            </TableCell>
                            <TableCell align="right">
                                {explicit ? 'Yes' : 'No'}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                {t('TRACK.KEY')}
                            </TableCell>
                            <TableCell align="right">
                                {keyToText(trackKey)}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                {t('TRACK.MODE')}
                            </TableCell>
                            <TableCell align="right">
                                {mode === 0 ? 'Minor' : 'Major'}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                {t('TRACK.TEMPO')}
                            </TableCell>
                            <TableCell align="right">
                                {tempo}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                {t('TRACK.TIME_SIGNATURE')}
                            </TableCell>
                            <TableCell align="right">
                                {timeSignature}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
