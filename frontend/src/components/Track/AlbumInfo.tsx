import React from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableRow, Paper, Typography,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();

    return (
        <>
            <Typography>
                {t('TRACK.ALBUM_INFORMATION')}
            </Typography>
            <TableContainer component={Paper}>
                <Table aria-label="simple table" size="small">
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
                                {t('TRACK.RELEASE_DATE')}
                            </TableCell>
                            <TableCell align="right">
                                {releaseDate}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                {t('TRACK.AMOUNT_OF_TRACKS')}
                            </TableCell>
                            <TableCell align="right">
                                {tracks}
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
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
