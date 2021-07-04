import React from 'react';
import { Typography } from '@material-ui/core';
import ResultBox, { Result } from '../ResultBox';

export interface RecentInterface {
    Results: Result[];
    Success: boolean;
    Error: string;
}

export default function RecentPage(props: {
    results: Result[] | undefined,
}) {
    const { results } = props;
    if (results === undefined) {
        return null;
    }
    return (
        <>
            <Typography component="h4" variant="h4" align="center">
                Your recent tracks
            </Typography>
            <br />
            <ResultBox results={results} />
        </>
    );
}
