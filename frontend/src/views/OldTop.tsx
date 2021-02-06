/* eslint-disable max-len */
import React from 'react';
import {
    makeStyles, Grid, Container, Card, CardContent, Typography,
} from '@material-ui/core';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import axios from 'axios';
import { useQuery } from 'react-query';
import Alert from '@material-ui/lab/Alert';
import SongCardRight from '../components/SongCardRight';
import ResultBox from '../components/ResultBox';
import Loading from '../components/Loading';
import Graph from '../components/Graph';

const useStyles = makeStyles({
    root: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});

function getDate(unix: number): string {
    return new Date(unix * 1000).toLocaleDateString('en-US');
}

function secToText(seconds: number): string {
    let sec = seconds;
    let minutes = Math.floor(seconds / 60);
    sec %= 60;
    const hours = Math.floor(minutes / 60);
    minutes %= 60;
    let text = '';
    if (hours !== 0) text += `${hours} Hours, `;
    if (sec !== 0) text += `${minutes} Minutes and ${sec} Seconds`;
    else text += `${minutes} Minutes`;
    return text;
}

export interface OldTopInterface {
    Result: Result;
    Success: boolean;
}

export interface Result {
    Count: number;
    TopTracks: TopTrack[];
    Hours: { [key: string]: number };
    Days: { [key: string]: number };
    TotalListened: number;
}

export interface TopTrack {
    Count: number;
    Name: string;
    Artist: string;
    Image: string;
    URI: string;
}

export default function OldTop() {
    const today = new Date();
    const [selectedDate, setSelectedDate] = React.useState(new Date(today.getFullYear(), today.getMonth() - 1, today.getDate(), 0, 0, 0));
    const classes = useStyles();
    const { data, status, error } = useQuery(['oldtop', selectedDate], () => axios.get<OldTopInterface>(`/api/top/old/${selectedDate.getTime() / 1000}`, {
        withCredentials: true,
    }));

    const handleDateChange = (date: MaterialUiPickersDate) => {
        if (date !== null) setSelectedDate(date);
    };

    const titleText = (
        <div>
            <Typography align="center" color="textPrimary" variant="h4">
                Your Listening Statistics
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" align="center">
                This app does not have access to information older than the moment that you first used the app
                <br />
                To disable user tracking, go to Settings and uncheck Recent Tracks Tracking
            </Typography>
        </div>
    );

    const datepicker = (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container justify="space-around">
                <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="dd/MM/yyyy"
                    margin="normal"
                    id="oldtop-date-picker-inline"
                    label="Select the Date from which to search"
                    value={selectedDate}
                    onChange={handleDateChange}
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
                />
            </Grid>
        </MuiPickersUtilsProvider>
    );

    let topsong = null;
    let errorComponent = null;
    if (status === 'error' || data?.data.Success === false) {
        if (typeof error === 'object' && error != null) {
            if (error.toString() !== '') {
                errorComponent = (
                    <Container maxWidth="xs">
                        <Alert severity="error">{error.toString()}</Alert>
                    </Container>
                );
            }
        } else {
            errorComponent = (
                <Container maxWidth="xs">
                    <Alert severity="error">Could not extract data from server</Alert>
                </Container>
            );
        }
        return (
            <div>
                {titleText}
                {datepicker}
                {errorComponent}
            </div>
        );
    }
    if (status === 'loading' || data === undefined) {
        return (
            <div>
                {titleText}
                {datepicker}
                <Loading />
            </div>
        );
    }
    const oldTop = data?.data;

    if (oldTop.Result.TopTracks.length > 0) {
        topsong = (
            <SongCardRight
                name={oldTop.Result.TopTracks[0].Name}
                artist={oldTop.Result.TopTracks[0].Artist}
                image={oldTop.Result.TopTracks[0].Image}
                count={oldTop.Result.TopTracks[0].Count}
            />
        );
    }

    const hoursdata: { value: number; argument: string; }[] = [];
    Object.keys(oldTop.Result.Hours).forEach((key) => {
        hoursdata.push({
            value: oldTop.Result.Hours[key],
            argument: key,
        });
    });

    const daysdata: { value: number; argument: string; }[] = [];
    Object.keys(oldTop.Result.Hours).forEach((key) => {
        daysdata.push({
            value: oldTop.Result.Days[key],
            argument: getDate(parseInt(key, 10)),
        });
    });

    const totallistenedtime = secToText(oldTop.Result.TotalListened);
    const totallistenedtracks = oldTop.Result.Count;
    return (
        <div>
            {titleText}
            <Container maxWidth="sm">
                {datepicker}
            </Container>
            <br />
            <Container maxWidth="md">
                <Grid container spacing={2}>
                    <Grid item md={4} xs={12}>
                        <Card>
                            <CardContent>
                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                                    You listened to
                                </Typography>
                                <Typography variant="h5" component="h2">
                                    {totallistenedtracks}
                                    {' '}
                                    Tracks
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item md={8} xs={12}>
                        <Card>
                            <CardContent>
                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                                    You spent
                                </Typography>
                                <Typography variant="h5" component="h2">
                                    {totallistenedtime}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
            <Container maxWidth="md">
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        {topsong}
                    </Grid>
                </Grid>
            </Container>
            <Container maxWidth="md">
                <Grid container spacing={2}>
                    <Grid item md={6} xs={12}>
                        <Card>
                            <CardContent>
                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                                    Total number of tracks per hour
                                </Typography>
                                <Graph data={hoursdata} argument />
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Card>
                            <CardContent>
                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                                    Total number of tracks per day
                                </Typography>
                                <Graph data={daysdata} zoom />
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
            <br />
            <Typography component="h4" variant="h4" align="center">
                Here are your most listened tracks from this period
            </Typography>
            <Container>
                <ResultBox results={oldTop.Result.TopTracks} />
            </Container>
        </div>
    );
}
