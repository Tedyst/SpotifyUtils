import React from 'react';
import { Typography } from '@material-ui/core';
import ResultBox, { Result } from '../ResultBox';

export interface RecentInterface {
    Results: Result[];
    Success: boolean;
    Error: string;
}

export default function RecentPage(props: {
    results: Result[],
}) {
    const { results } = props;
    return (
        <div>
            <Typography component="h4" variant="h4" align="center">
                Your recent tracks
            </Typography>
            <br />
            <ResultBox results={results} />
        </div>
    );
}
