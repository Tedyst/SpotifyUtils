/* eslint-disable max-len */
import React from 'react';
import {
    makeStyles, Grid, Container, Card, CardContent, Typography,
} from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import { HumanizeDuration, HumanizeDurationLanguage } from 'humanize-duration-ts';
import { Trans, useTranslation } from 'react-i18next';
import SongCardRight from '../SongCardRight';
import ResultBox from '../ResultBox';
import Graph from '../Graph';
import i18n from '../../i18n';

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
    const langService = new HumanizeDurationLanguage();
    const humanizer = new HumanizeDuration(langService);
    humanizer.setOptions({
        language: i18n.languages[0],
    });
    return humanizer.humanize(seconds * 1000);
}

export interface ListeningStatsInterface {
    Result: Result;
    Success: boolean;
    Error?: string;
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
    data: ListeningStatsInterface | undefined,
    setSelectedDate?: (b: Date) => void,
    selectedDate: Date,
}) {
    const classes = useStyles();
    const { t } = useTranslation();
    const { data, setSelectedDate, selectedDate } = props;

    const handleDateChange = (date: Date | null) => {
        if (date !== null && setSelectedDate !== undefined) setSelectedDate(date);
    };

    const titleText = (
        <>
            <Typography align="center" color="textPrimary" variant="h4">
                {t('LISTENING_STATS.YOUR_STATISTICS')}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" align="center">
                {t('LISTENING_STATS.SUBTITLE_1')}
                <br />
                {t('LISTENING_STATS.SUBTITLE_2')}
            </Typography>
        </>
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
                    label={t('LISTENING_STATS.SELECT_DATE_START')}
                    margin="normal"
                    onChange={handleDateChange}
                    value={selectedDate}
                    variant="inline"
                />
            </Grid>
        </MuiPickersUtilsProvider>
    );

    if (!data) {
        return (
            <>
                {titleText}
                <Container maxWidth="sm">
                    {datepicker}
                </Container>
            </>
        );
    }

    let topsong = null;

    if (data?.Result?.TopTracks && data?.Result?.TopTracks?.length > 0) {
        topsong = (
            <SongCardRight
                artist={data.Result.TopTracks[0]?.Artist}
                count={data.Result.TopTracks[0]?.Count}
                image={data.Result.TopTracks[0]?.Image}
                name={data.Result.TopTracks[0]?.Name}
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
        <>
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
                                    {t('LISTENING_STATS.YOU_LISTENED_TO')}
                                </Typography>
                                <Typography variant="h5" component="h2">
                                    <Trans
                                        i18nKey="LISTENING_STATS.TRACKS"
                                        values={{ count: totallistenedtracks }}
                                    >
                                        {'{{count}} Tracks'}
                                    </Trans>
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item md={8} xs={12}>
                        <Card>
                            <CardContent>
                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                                    {t('LISTENING_STATS.YOU_SPENT')}
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
                                    {t('LISTENING_STATS.TOTAL_NUMBER_OF_TRACKS_PER_HOUR')}
                                </Typography>
                                <Graph data={hoursdata} argument />
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Card>
                            <CardContent>
                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                                    {t('LISTENING_STATS.TOTAL_NUMBER_OF_TRACKS_PER_DAY')}
                                </Typography>
                                <Graph data={daysdata} zoom />
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
            <br />
            <Typography component="h4" variant="h4" align="center">
                {t('LISTENING_STATS.THE_MOST_LISTENED_TRACKS_PERIOD')}
            </Typography>
            <Container>
                <ResultBox results={data.Result.TopTracks} />
            </Container>
        </>
    );
}

ListeningStatsComp.defaultProps = {
    setSelectedDate: undefined,
};
