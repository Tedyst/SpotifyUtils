import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import Typography from '@material-ui/core/Typography';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

function msToText(ms){
    let seconds = Math.floor(ms / 1000);
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    let hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    if(hours !== 0)
        return hours + " Hours";
    if(minutes !== 0){
        if(seconds !== 0)
            return minutes + " Minutes and " + seconds + " Seconds";
        return minutes + " Minutes";
    }
    return seconds + " Seconds";
}

function keyToText(key){
    if(key <= 1) return "C";
    if(key <= 3) return "D";
    if(key <= 5) return "E";
    if(key <= 7) return "F";
    if(key <= 8) return "G";
    if(key <= 10) return "A";
    if(key <= 11) return "B";
    return "None";
}

export default function TrackInfo(props){
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
                <TableCell align="right">{props.explicit}</TableCell>
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
                <TableCell align="right">{props.mode}</TableCell>
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
                <TableCell align="right">{props.time_signature}</TableCell>
            </TableRow>
        </TableBody>
    </Table>
    </TableContainer>
    </div>
    )
}