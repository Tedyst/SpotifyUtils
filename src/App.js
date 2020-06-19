import React, { useState } from 'react';
import Login from './views/Login';
import PlaylistSearch from './views/PlaylistSearch';
import PlaylistView from './views/PlaylistView';
import Track from './views/Track';
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
  selectLogged,
  selectUsername,
  selectImage,
  setPathName,
  selectPathname
} from './store/user';
import Sidebar from './views/Sidebar';
import { makeStyles } from '@material-ui/core';
import UpdateUser from './utils/status';

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
  const image = useSelector(selectImage);
  const classes = useStyles();
  const [Updating, setUpdating] = useState(false);
  if(Updating === false){
    setUpdating(true);
    UpdateUser();
  }

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
            <Login 
              mainUpdate={setUpdating}
            />
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
          <Route path="/track">
            <Track />
          </Route>
          <Route path='/logout' component={() => window.location = 
            window.location.protocol + "//" + window.location.host + "/logout" }/>
          <Route path='/admin' component={() => window.location = 
            window.location.protocol + "//" + window.location.host + "/admin" }/>
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
  const pathname = useSelector(selectPathname);
  if(props.logged === true && location.pathname === "/auth"){
    if(pathname !== "/auth"){
      return <Redirect to={pathname} />
    }
    return null;
  }
  if(props.logged){
    return null;
  }
  if(location.pathname !== "/auth"){
    dispatch(setPathName(location.pathname));
    return <Redirect to="/auth" />
  }
  return null;
}

function Home(){
  return "Home"
}

export default App;
