import React from 'react';
import {
    Table, TableBody, TableCell, TableContainer, Typography, TableRow, Paper,
} from '@material-ui/core';
import { HumanizeDuration, HumanizeDurationLanguage } from 'humanize-duration-ts';
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
    return (
        <>
            <Typography>
                Track Information
            </Typography>
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableBody>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                Popularity
                            </TableCell>
                            <TableCell align="right">
                                {popularity}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                Length
                            </TableCell>
                            <TableCell align="right">
                                {msToText(length)}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                Spotify markets
                            </TableCell>
                            <TableCell align="right">
                                {markets}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                Explicit
                            </TableCell>
                            <TableCell align="right">
                                {explicit ? 'Yes' : 'No'}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                Key
                            </TableCell>
                            <TableCell align="right">
                                {keyToText(trackKey)}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                Mode
                            </TableCell>
                            <TableCell align="right">
                                {mode === 0 ? 'Minor' : 'Major'}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                Tempo
                            </TableCell>
                            <TableCell align="right">
                                {tempo}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                Time signature
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
