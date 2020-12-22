import React, { useEffect, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { setLogged } from "../store/user";
import { useDispatch } from "react-redux";
import UpdateUser from "../utils/status";

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
  const dispatch = useDispatch();

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
        },
        body: JSON.stringify({
          host: window.location.protocol + "//" + window.location.host,
          code: code,
        }),
        cache: "no-store",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success === true) {
            UpdateUser();
          }
        });
    }
  }, [code, dispatch]);

  return <LoginPage loggingIn={code !== null} />;
}

function LoginPage(props: { loggingIn: boolean }) {
  const [LoginUrl, setLoginUrl] = useState("");
  const classes = useStyles();
  useEffect(() => {
    fetch("/api/auth-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        host: window.location.protocol + "//" + window.location.host,
      }),
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((data) => {
        setLoginUrl(data.URL);
      });
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
