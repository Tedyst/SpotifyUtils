import React from 'react';
import { Table, TableBody, TableCell, TableContainer, Typography, TableRow, Paper } from '@material-ui/core';

function msToText(ms: number) {
    let seconds = Math.floor(ms / 1000);
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    let hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    if (hours !== 0)
        return hours + " Hours";
    if (minutes !== 0) {
        if (seconds !== 0)
            return minutes + " Minutes and " + seconds + " Seconds";
        return minutes + " Minutes";
    }
    return seconds + " Seconds";
}

function keyToText(key: number) {
    if (key === -1) return "None";
    if (key <= 1) return "C";
    if (key <= 3) return "D";
    if (key <= 5) return "E";
    if (key <= 7) return "F";
    if (key <= 8) return "G";
    if (key <= 10) return "A";
    if (key <= 11) return "B";
    return "None";
}

export default function TrackInfo(props: {
    popularity: number,
    length: number,
    markets: number,
    explicit: boolean,
    track_key: number,
    mode: number,
    tempo: number,
    timeSignature: number
}) {
    return (<div>
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
                        <TableCell align="right">{props.popularity}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell component="th" scope="row">
                            Length
                </TableCell>
                        <TableCell align="right">{msToText(props.length)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell component="th" scope="row">
                            Spotify markets
                </TableCell>
                        <TableCell align="right">{props.markets}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell component="th" scope="row">
                            Explicit
                </TableCell>
                        <TableCell align="right">{props.explicit ? "Yes" : "No"}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell component="th" scope="row">
                            Key
                </TableCell>
                        <TableCell align="right">{keyToText(props.track_key)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell component="th" scope="row">
                            Mode
                </TableCell>
                        <TableCell align="right">{props.mode === 0 ? "Minor" : "Major"}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell component="th" scope="row">
                            Tempo
                </TableCell>
                        <TableCell align="right">{props.tempo}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell component="th" scope="row">
                            Time signature
                </TableCell>
                        <TableCell align="right">
{props.timeSignature}
</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    </div>
    )
}