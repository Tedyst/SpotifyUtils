import React from 'react';
import {
    Table, TableBody, TableCell, TableContainer, Typography, TableRow, Paper,
} from '@material-ui/core';

function msToText(ms: number) {
    let seconds = Math.floor(ms / 1000);
    let minutes = Math.floor(seconds / 60);
    seconds %= 60;
    const hours = Math.floor(minutes / 60);
    minutes %= 60;
    if (hours !== 0) return `${hours} Hours`;
    if (minutes !== 0) {
        if (seconds !== 0) return `${minutes} Minutes and ${seconds} Seconds`;
        return `${minutes} Minutes`;
    }
    return `${seconds} Seconds`;
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
        <div>
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
        </div>
    );
}
