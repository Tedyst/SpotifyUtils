import React, { useEffect } from 'react';
// import { makeStyles } from '@material-ui/core/styles';
import { Grid, Container } from '@material-ui/core';
import Graph from '../components/Graph';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
// import SongCard from '../components/SongCard'

// const useStyles = makeStyles((theme) => ({
//     root: {
//         flexGrow: 1
//     },
//     fullWidth: {
//         width: '100%'
//     }
// }));

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


export default function OldTop() {
    const [oldTop, setOldTop] = React.useState<{
        "Result": {
            Count: number,
            TopTracks: {
                Count: number,
                Name: string,
                Artist: string,
            }[],
            Hours: number[],
            Days: number[],
            TotalListened: number,
        },
        "Success": boolean
    }>();
    var today = new Date();
    const [selectedDate, setSelectedDate] = React.useState(new Date(today.getFullYear()-1, today.getMonth(), today.getDate(), 0, 0, 0));

    const handleDateChange = (date: MaterialUiPickersDate, value: string | null | undefined) => {
        if(date !== null)
            setSelectedDate(date);
    };

    useEffect(() => {
        if (selectedDate !== null)
            fetch('/api/top/old/' + selectedDate.getTime() / 1000, { cache: "no-store" }).then(res => res.json()).then(data => {
                if (data.Success === true)
                    setOldTop(data);
            });
    }, [selectedDate])

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

    let topsong = null;
    if (oldTop === undefined)
        return datepicker;

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
        <Container maxWidth="sm">
            {topsong}
            <br />
            {datepicker}
            {totallistenedtracks} Tracks
            <br />
            {totallistenedtime}
            <br />
            Total number of songs per hour
            <Graph data={hoursdata} />
            <br />
            Total number of songs per day
            <Graph data={daysdata} zoom={true} />
        </Container>
    );
}