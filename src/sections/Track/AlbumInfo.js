import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

export default function AlbumInfo(props){
    return (
    <div>
    <Typography>
        Album Information
    </Typography>
    <TableContainer component={Paper}>
    <Table aria-label="simple table" size="small">
        <TableBody>
            <TableRow>
                <TableCell component="th" scope="row">
                    Popularity
                </TableCell>
                <TableCell align="right">{props.popularity}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell component="th" scope="row">
                    Release Date
                </TableCell>
                <TableCell align="right">{props.release_date}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell component="th" scope="row">
                    Amount of Tracks
                </TableCell>
                <TableCell align="right">{props.tracks}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell component="th" scope="row">
                    Spotify Markets
                </TableCell>
                <TableCell align="right">{props.markets}</TableCell>
            </TableRow>
        </TableBody>
    </Table>
    </TableContainer>
    </div>
    )
}