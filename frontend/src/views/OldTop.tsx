import React from 'react';
import { makeStyles, Grid, Container, Card, CardContent, Typography } from '@material-ui/core';
import Graph from '../components/Graph';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import SongCardRight from '../components/SongCardRight'
import ResultBox from '../components/ResultBox';
import Loading from '../components/Loading';
import axios from 'axios';
import { useQuery } from 'react-query';


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
    return new Date(unix * 1000).toLocaleDateString("en-US");
}

function secToText(seconds: number): string {
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    let hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    let text = "";
    if (hours !== 0)
        text += hours + " Hours, ";
    if (seconds !== 0)
        text += minutes + " Minutes and " + seconds + " Seconds";
    else text += minutes + " Minutes";
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
    var today = new Date();
    const [selectedDate, setSelectedDate] = React.useState(new Date(today.getFullYear(), today.getMonth() - 1, today.getDate(), 0, 0, 0));
    const classes = useStyles();
    const { data, status } = useQuery(['oldtop', selectedDate], () =>
        axios.get<OldTopInterface>('/api/top/old/' + selectedDate.getTime() / 1000, {
            withCredentials: true
        }))

    const handleDateChange = (date: MaterialUiPickersDate, value: string | null | undefined) => {
        if (date !== null)
            setSelectedDate(date);
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
        </div>);

    let datepicker = (<MuiPickersUtilsProvider utils={DateFnsUtils}>
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
    </MuiPickersUtilsProvider>);

    let topsong = null
    if (status === "loading" || status === "error" || data === undefined)
        return (
            <div>
                {titleText}
                {datepicker}
                <Loading />
            </div>)
    let oldTop = data?.data

    if (oldTop.Result.TopTracks.length > 0) {
        topsong = (<SongCardRight
            name={oldTop.Result.TopTracks[0].Name}
            artist={oldTop.Result.TopTracks[0].Artist}
            image={oldTop.Result.TopTracks[0].Image}
            count={oldTop.Result.TopTracks[0].Count}
        />)
    }

    let hoursdata = [];
    for (const elem in oldTop.Result.Hours) {
        hoursdata.push({
            value: oldTop.Result.Hours[elem],
            argument: elem
        })
    }

    let daysdata = [];
    for (let elem in oldTop.Result.Days) {
        daysdata.push({
            value: oldTop.Result.Days[elem],
            argument: getDate(parseInt(elem))
        })
    }

    let totallistenedtime = secToText(oldTop.Result.TotalListened);
    let totallistenedtracks = oldTop.Result.Count;
    return (
        <div>
            {titleText}
            <Container maxWidth="sm">
                {datepicker}
            </Container>
            <br />
            <Container maxWidth="md">
                <Grid container spacing={2} >
                    <Grid item md={4} xs={12}>
                        <Card >
                            <CardContent>
                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                                    You listened to
                                </Typography>
                                <Typography variant="h5" component="h2">
                                    {totallistenedtracks} Tracks
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item md={8} xs={12}>
                        <Card >
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
                <Grid container spacing={2} >
                    <Grid item xs={12}>
                        {topsong}
                    </Grid>
                </Grid>
            </Container>
            <Container maxWidth="md">
                <Grid container spacing={2} >
                    <Grid item md={6} xs={12}>
                        <Card >
                            <CardContent>
                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                                    Total number of tracks per hour
                                </Typography>
                                <Graph data={hoursdata} argument={true} />
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Card >
                            <CardContent>
                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                                    Total number of tracks per day
                                </Typography>
                                <Graph data={daysdata} zoom={true} />
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
        </div >
    );
}