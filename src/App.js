import React from 'react';
import './App.css';
import Login from './views/Login';
import ResultView from './views/ResultView';
import { useSelector, useDispatch } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import {
  setLogged,
  selectLogged,
  setPlaylists,
  setUsername,
  selectUsername
} from './store/user';
import Sidebar from './views/Sidebar';
import { makeStyles } from '@material-ui/core';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));

function App() {
  const logged = useSelector(selectLogged);
  const username = useSelector(selectUsername);
  const classes = useStyles();
  const dispatch = useDispatch();
  console.log("Logged is " + logged);
  if(!logged){
    fetch('/status').then(res => res.json()).then(data => {
      console.log("setLogged" + data.logged);
        dispatch(setLogged(data.logged));
        dispatch(setPlaylists(data.playlists));
        if(!data.username)
          dispatch(setUsername("Not Logged In"));
        else
          dispatch(setUsername(data.username));
      });
    }
  let redirect = null;
  if(!logged){
    redirect = <Redirect to="/auth" />
  } 

  return (
    <div className={classes.root}>
      <Router>
      <Sidebar username={username}/>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Switch>
          <Route path="/auth">
            <Login />
          </Route>
          <Route path="/test">
            <Home />
          </Route>
          <Route path="/">
            <ResultView />
          </Route>
        </Switch>
        {redirect}
      </main>
      </Router>
    </div>
    
  );
}

function Home() {
  return "Sal"
}

export default App;
