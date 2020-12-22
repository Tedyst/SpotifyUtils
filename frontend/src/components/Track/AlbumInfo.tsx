import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper, Typography } from '@material-ui/core';

export default function AlbumInfo(props: {
    popularity: string;
    release_date: string;
    tracks: string;
    markets: string;
}) {
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