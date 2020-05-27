import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import UpdateUser from '../utils/status';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Login() {
    const classes = useStyles();
    const [LoginUrl, setLoginUrl] = useState("");
    const [Updating, setUpdating] = useState(false);

    let search = window.location.search;
    let params = new URLSearchParams(search);
    let code = params.get('code');

    if(Updating === false) {
      setUpdating(true);
      // The url for login
      fetch('/auth-url', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "host":  window.location.protocol + "//" + window.location.host
          }),
        }).then(res => res.json()).then(data => {
          setLoginUrl(data.url);
        });
      if(code !== null) {
        // Check if the code works
        fetch('/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "host": window.location.protocol + "//" + window.location.host,
            "code": code
          }),
        } ).then(res => res.json()).then(data => {
          if(data.success === true) {
              UpdateUser();
          }
        });
      }
    }

    return loginPage(classes, LoginUrl);
}

function loginPage(classes, LoginUrl){
  return (
    <Container maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
            <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography variant="h5">
            Sign in
            </Typography>
            <form className={classes.form} noValidate>
            <Typography variant="body2" color="textPrimary" align="center">
                To use the app you need to sign in using Spotify.
            </Typography>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                href={LoginUrl}
                disabled={LoginUrl === "" ? true : false}
            >
                Sign in using Spotify
            </Button>
            </form>
        </div>
    </Container>
    )
}