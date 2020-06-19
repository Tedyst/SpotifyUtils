import React from 'react';
import {
    selectRecent
} from '../store/user';
import { useSelector } from 'react-redux';
import ResultBox from '../components/ResultBox';
import Typography from '@material-ui/core/Typography';

export default function Recent() {
    const Results = useSelector(selectRecent);
    console.log(Results);
    return (
        <div>
        <Typography component="h4" variant="h4" align="center">
            Your recent tracks
        </Typography>
        <br />
        <ResultBox results={Results["results"]}/>
        </div>
    )
}