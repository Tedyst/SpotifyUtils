import React from "react";
import { Avatar, Button, CssBaseline, Typography, makeStyles, Container } from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { useQuery, useQueryClient } from "react-query";
import axios from "axios";
import Loading from "../components/Loading";

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

function LoginWithCode(props: { code: string }) {
  const queryClient = useQueryClient()
  const { isLoading, error, data } = useQuery('auth', () =>
    axios.post<AuthInterface>('/api/auth', {
      host: window.location.protocol + "//" + window.location.host,
      code: props.code,
    }, {
      withCredentials: true
    }))
  if (isLoading) {
    return <LoginPage loggingIn={true} />
  }
  if (error) {
    return <LoginPage loggingIn={false} />
  }
  if (data?.data.success) {
    queryClient.invalidateQueries('status')
    queryClient.invalidateQueries('top')
    return <LoginPage loggingIn={true} />
  }
  return <LoginPage loggingIn={true} />
}

export default function Login() {
  let search = window.location.search;
  let params = new URLSearchParams(search);
  let code = params.get("code");
  if (code === null) {
    return <LoginPage loggingIn={false} />
  }

  return <LoginWithCode code={code} />
}
interface AuthURLInterface {
  success: boolean;
  URL: string;
}

interface AuthInterface {
  success: boolean;
}

function LoginPage(props: { loggingIn: boolean }) {
  const classes = useStyles();
  const { data, status } = useQuery('authURL', () =>
    axios.get<AuthURLInterface>('/api/auth-url?host=' + window.location.protocol + "//" + window.location.host, {
      withCredentials: true
    }))
  if (status === "loading" || status === "error") {
    return <Loading />
  }
  if (data === undefined) {
    return <Loading />
  }

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
            href={data.data.URL}
            disabled={
              props.loggingIn
            }
          >
            {buttonText}
          </Button>
        </form>
      </div>
    </Container>
  );
}
