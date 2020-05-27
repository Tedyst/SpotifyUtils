import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Redirect } from 'react-router-dom';
import {
  setLogged,
  selectLogged,
  setPlaylists,
  setUsername,
  setImage,
  setPathName,
  selectPathname
} from '../store/user';
import { useSelector, useDispatch } from 'react-redux';


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
    const logged = useSelector(selectLogged);
    const pathname = useSelector(selectPathname);
    const dispatch = useDispatch();

    let search = window.location.search;
    let params = new URLSearchParams(search);
    let code = params.get('code');

    useEffect(() => {
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
              fetch('/status').then(res => res.json()).then(data => {
                dispatch(setLogged(data.logged));
                dispatch(setPlaylists(data.playlists));
                dispatch(setImage(data.image));
                if(!data.username)
                  dispatch(setUsername("Not Logged In"));
                else
                  dispatch(setUsername(data.username));
              });
            
          }
        });
      }
    });
    if(logged){
      if(pathname !== ""){
        dispatch(setPathName(""));
        return <Redirect to={pathname} />
      }
      return <Redirect to="/" />
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