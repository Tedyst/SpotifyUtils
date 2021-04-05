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
import SongCardRight from '../SongCardRight';
import ResultBox from '../ResultBox';
import Graph from '../Graph';

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
    text += sec !== 0 ? `${minutes} Minutes and ${sec} Seconds` : `${minutes} Minutes`;
    return text;
}

export interface ListeningStatsInterface {
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

export default function ListeningStatsComp(props: {
    data: ListeningStatsInterface,
    setSelectedDate?: React.Dispatch<React.SetStateAction<Date>> | undefined,
    selectedDate: Date,
}) {
    const classes = useStyles();
    const { data, setSelectedDate, selectedDate } = props;

    const handleDateChange = (date: MaterialUiPickersDate) => {
        if (date !== null && setSelectedDate !== undefined) setSelectedDate(date);
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
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
                    disableToolbar
                    format="dd/MM/yyyy"
                    id="listeningstats-date-picker-inline"
                    label="Select the Date from which to search"
                    margin="normal"
                    onChange={handleDateChange}
                    value={selectedDate}
                    variant="inline"
                />
            </Grid>
        </MuiPickersUtilsProvider>
    );

    let topsong = null;

    if (data.Result.TopTracks.length > 0) {
        topsong = (
            <SongCardRight
                artist={data.Result.TopTracks[0].Artist}
                count={data.Result.TopTracks[0].Count}
                image={data.Result.TopTracks[0].Image}
                name={data.Result.TopTracks[0].Name}
            />
        );
    }

    const hoursdata: { value: number; argument: string; }[] = [];
    Object.keys(data.Result.Hours).forEach((key) => {
        hoursdata.push({
            value: data.Result.Hours[key],
            argument: key,
        });
    });

    const daysdata: { value: number; argument: string; }[] = [];
    Object.keys(data.Result.Days).forEach((key) => {
        daysdata.push({
            value: data.Result.Days[key],
            argument: getDate(parseInt(key, 10)),
        });
    });

    const totallistenedtime = secToText(data.Result.TotalListened);
    const totallistenedtracks = data.Result.Count;
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
                <ResultBox results={data.Result.TopTracks} />
            </Container>
        </div>
    );
}

ListeningStatsComp.defaultProps = {
    setSelectedDate: undefined,
};
