import React, { useEffect } from 'react';
import { Button, Container, Card, Typography, makeStyles, CardContent, Checkbox, FormControlLabel } from '@material-ui/core';
import Loading from '../components/Loading';
import { useSelector } from 'react-redux';
import { selectCSRFToken } from '../store/user';

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    pos: {
        marginBottom: 12,
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        width: "100%",
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    a: {
        color: "inherit",
    }
}));

export default function Recent() {
    const classes = useStyles();
    const [recentTracks, setRecentTracks] = React.useState(true);
    const [loading, setLoading] = React.useState(true);


    const handleChangeRecentTracks = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRecentTracks(Boolean((event.target as HTMLInputElement).checked));
    };

    useEffect(() => {
        fetch("/api/settings", {
            method: "GET",
            cache: "no-store",
            credentials: "same-origin"
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.Success) {
                    setRecentTracks(data.Settings.RecentTracks);
                    setLoading(false);
                }
            });
    }, []);

    const CSRFToken = useSelector(selectCSRFToken);
    const onSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        fetch("/api/settings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": CSRFToken,
            },
            body: JSON.stringify({
                RecentTracks: recentTracks,
            }),
            cache: "no-store",
            credentials: "same-origin"
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.Success) {
                    setRecentTracks(data.Settings.RecentTracks);
                }
            });

    }

    if (loading === true) {
        return <Loading />
    }

    return <div>
        <Typography color="textPrimary" gutterBottom variant="h5" align="center">
            Here you can adjust your user settings
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" align="center">
            If you want to see what the app is doing in the background, you can check the <a href="https://github.com/Tedyst/SpotifyUtils" className={classes.a}>GitHub page</a>
        </Typography>
        <Container maxWidth="xs">
            <Card className={classes.root}>
                <CardContent>
                    <form onSubmit={onSubmit} className={classes.form}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={recentTracks}
                                    onChange={handleChangeRecentTracks}
                                    name="checkedB"
                                    color="primary"
                                />
                            }
                            label="Enable Recent Tracks Tracking"
                        />
                        <br />
                        <Button type="submit" variant="contained" color="primary" className={classes.submit}>
                            Submit
                    </Button>
                    </form>
                </CardContent>
            </Card>
        </Container ></div>;
}