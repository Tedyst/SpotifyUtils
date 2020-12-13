import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    selectOldTop
} from '../store/user';
import { useSelector } from 'react-redux';
import Container from '@material-ui/core/Container';
import { Grid } from '@material-ui/core';
import ArtistCard from '../sections/Top/ArtistCard';
import SongCard from '../sections/Top/SongCard';
import Typography from '@material-ui/core/Typography';
import List from '../sections/Top/List';
import Graph from '../sections/OldTop/Graph';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1
    },
    fullWidth: {
        width: '100%'
    }
}));

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
    const oldtop = useSelector(selectOldTop);
    if (oldtop === null)
        return null;
    if (oldtop.Success === false)
        return null;
    let hoursdata = [];
    for (const elem in oldtop.Result.Hours) {
        hoursdata.push({
            value: oldtop.Result.Hours[elem],
            argument: elem
        })
    }

    let daysdata = [];
    for (const elem in oldtop.Result.Days) {
        daysdata.push({
            value: oldtop.Result.Days[elem],
            argument: getDate(elem)
        })
    }

    let totallistened = secToText(oldtop.Result.TotalListened);
    return (
        <div>
            {totallistened}
            <Graph data={hoursdata} name="Total number of songs per hour" />
            <br />
            <Graph data={daysdata} name="Total number of songs per day" zoom={true} />
        </div>
    );
}