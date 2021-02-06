import React from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableRow, Paper, Typography,
} from '@material-ui/core';

export default function AlbumInfo(props: {
    popularity: number;
    releaseDate: string;
    tracks: number;
    markets: number;
}) {
    const {
        popularity,
        releaseDate,
        tracks,
        markets,
    } = props;

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
                            <TableCell align="right">
{popularity}
</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                Release Date
                            </TableCell>
                            <TableCell align="right">
{releaseDate}
</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                Amount of Tracks
                            </TableCell>
                            <TableCell align="right">
{tracks}
</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                Spotify Markets
                            </TableCell>
                            <TableCell align="right">
{markets}
</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
