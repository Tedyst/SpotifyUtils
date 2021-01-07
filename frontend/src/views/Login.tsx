import React, { useEffect, useState } from "react";
import { Avatar, Button, CssBaseline, Typography, makeStyles, Container } from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import UpdateUser from "../utils/status";
import {
  Redirect,
} from "react-router-dom";
import store from "../store/store";
import { selectCSRFToken, setCSRFToken } from "../store/user";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Login() {
  const [logged, setLogged] = React.useState(false);
  const [error, setError] = React.useState(false);
  const CSRFToken = useSelector(selectCSRFToken);

  let search = window.location.search;
  let params = new URLSearchParams(search);
  let code = params.get("code");

  useEffect(() => {
    if (code !== null) {
      // Check if the code works
      fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": CSRFToken,
        },
        body: JSON.stringify({
          host: window.location.protocol + "//" + window.location.host,
          code: code,
        }),
        cache: "no-store",
        credentials: "same-origin"
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success === true) {
            UpdateUser();
            setLogged(true);
          } else {
            setError(true)
          }
        }).catch(() => {
          setError(true);
        });
    }
  }, [code, CSRFToken]);

  if (code !== null && error === true) {
    return <Redirect to="/" />
  }

  if (logged) {
    return <Redirect to="/" />
  }

  return <LoginPage loggingIn={code !== null} />;
}

function LoginPage(props: { loggingIn: boolean }) {
  const [LoginUrl, setLoginUrl] = useState("");
  const classes = useStyles();
  useEffect(() => {
    let CSRFToken: string = "";
    fetch("/api/status", { cache: "no-store", credentials: "same-origin" })
      .then((res) => {
        let asd = res.headers.get("X-CSRF-Token");
        if (asd !== null) {
          CSRFToken = asd;
          store.dispatch(setCSRFToken(asd))
        }
      }).then(() => {
        fetch("/api/auth-url", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": CSRFToken
          },
          body: JSON.stringify({
            host: window.location.protocol + "//" + window.location.host,
          }),
          cache: "no-store",
          credentials: "same-origin"
        })
          .then((res) => res.json())
          .then((data) => {
            setLoginUrl(data.URL);
          });
      })
  }, []);

  let buttonText = props.loggingIn
    ? "Logging in... Please wait..."
    : "Sign in using Spotify";
  return (
    <Container maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant="h5">Sign in</Typography>
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
            disabled={
              LoginUrl === "" || props.loggingIn === true ? true : false
            }
          >
            {buttonText}
          </Button>
        </form>
      </div>
    </Container>
  );
}
