import React, { useEffect } from 'react';
// import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import Graph from '../sections/OldTop/Graph';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';

// const useStyles = makeStyles((theme) => ({
//     root: {
//         flexGrow: 1
//     },
//     fullWidth: {
//         width: '100%'
//     }
// }));

function getDate(unix) {
    return new Date(unix * 1000).toLocaleDateString("en-US");
}

function secToText(seconds) {
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
    const [oldTop, setOldTop] = React.useState(null);
    const [selectedDate, setSelectedDate] = React.useState(new Date());

    const handleDateChange = (date) => {
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

    if (oldTop === null)
        return datepicker;
    let hoursdata = [];
    for (const elem in oldTop.Result.Hours) {
        hoursdata.push({
            value: oldTop.Result.Hours[elem],
            argument: elem
        })
    }

    let daysdata = [];
    for (const elem in oldTop.Result.Days) {
        daysdata.push({
            value: oldTop.Result.Days[elem],
            argument: getDate(elem)
        })
    }

    let totallistenedtime = secToText(oldTop.Result.TotalListened);
    let totallistenedtracks = oldTop.Result.Count;
    return (
        <div>
            {datepicker}
            {totallistenedtracks} Tracks
            <br />
            {totallistenedtime}
            <Graph data={hoursdata} name="Total number of songs per hour" />
            <br />
            <Graph data={daysdata} name="Total number of songs per day" zoom={true} />
        </div>
    );
}