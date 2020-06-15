import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableContainer';
import Typography from '@material-ui/core/Typography';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

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
                <TableCell align="right">{props.length}</TableCell>
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
                <TableCell align="right">{props.track_key}</TableCell>
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