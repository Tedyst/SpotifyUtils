import React from 'react';
import './App.css';
import Login from './views/Login';
import PlaylistSearch from './views/PlaylistSearch';
import PlaylistView from './views/PlaylistView';
import Top from './views/Top';
import Compare from './views/Compare';
import { useSelector, useDispatch } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useLocation
} from "react-router-dom";
import {
  setLogged,
  selectLogged,
  setPlaylists,
  setUsername,
  selectUsername,
  selectImage,
  setImage,
  setPathName
} from './store/user';
import Sidebar from './views/Sidebar';
import { makeStyles } from '@material-ui/core';
import Cookies from 'js-cookie';

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
  Cookies.set("logged", logged);
  const username = useSelector(selectUsername);
  const image = useSelector(selectImage);
  const classes = useStyles();
  const dispatch = useDispatch();
  fetch('/status').then(res => res.json()).then(data => {
      dispatch(setLogged(data.logged));
      Cookies.set("logged", logged);
      dispatch(setPlaylists(data.playlists));
      dispatch(setImage(data.image));
      if(!data.username)
        dispatch(setUsername("Not Logged In"));
      else
        dispatch(setUsername(data.username));
    });

  return (
    <div className={classes.root}>
      <Router>
      <Sidebar
        username={username}
        image={image}
        />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Switch>
          <Route path="/auth">
            <Login />
          </Route>
          <Route path="/playlistsearch">
            <PlaylistSearch />
          </Route>
          <Route path="/lyrics">
            <PlaylistView />
          </Route>
          <Route path="/top">
            <Top />
          </Route>
          <Route path="/compare">
            <Compare />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
        <RedirectWithSave logged={logged}/>
      </main>
      </Router>
    </div>
    
  );
}

function RedirectWithSave(props) {
  const location = useLocation();
  const dispatch = useDispatch();
  if(props.logged)
    return null;
  if(location.pathname !== "/auth")
    dispatch(setPathName(location.pathname));
  console.log(location.pathname);
  return <Redirect to="/auth" />
}

function Home(){
  return "Home"
}

export default App;
