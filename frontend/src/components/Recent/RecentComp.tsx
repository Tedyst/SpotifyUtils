import React from 'react';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();
    if (results === undefined) {
        return null;
    }
    return (
        <>
            <Typography component="h4" variant="h4" align="center">
                {t('RECENT.YOUR_RECENT_TRACKS')}
            </Typography>
            <br />
            <ResultBox results={results} />
        </>
    );
}
