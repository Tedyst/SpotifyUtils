import React, { useState } from 'react';
import Login from './views/Login';
import PlaylistView from './views/PlaylistView';
import Track from './views/Track';
import Recent from './views/Recent';
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
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core';
import UpdateUser from './utils/status';
import TrackSearch from './views/TrackSearch';
import { useSwipeable } from "react-swipeable";
import OldTop from './views/OldTop';

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
  const darkTheme = createMuiTheme({
    palette: {
      type: 'dark',
    },
  });
  const logged = useSelector(selectLogged);
  const username = useSelector(selectUsername);
  const image = useSelector(selectImage);
  const classes = useStyles();
  const [Updating, setUpdating] = useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handlers = useSwipeable({
    trackMouse: false,
    onSwipedRight: () => setMobileOpen(true)
  });
  if (Updating === false) {
    setUpdating(true);
    UpdateUser();
  }

  return (
    <div className={classes.root} {...handlers}>
      <ThemeProvider theme={darkTheme}>
        <Router>
          <Sidebar
            username={username}
            image={image}
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
          />
          <main className={classes.content}>
            <div className={classes.toolbar} />
            <Switch>
              <Route path="/auth">
                <Login
                  mainUpdate={setUpdating}
                />
              </Route>
              <Route path="/playlist">
                <PlaylistView />
              </Route>
              <Route path="/tracksearch">
                <TrackSearch />
              </Route>
              <Route path="/top">
                <Top />
              </Route>
              <Route path="/oldtop">
                <OldTop />
              </Route>
              <Route path="/compare">
                <Compare />
              </Route>
              <Route path="/track">
                <Track />
              </Route>
              <Route path="/recent">
                <Recent />
              </Route>
              <Route path='/logout' component={() => <div>Logging out...</div>} />
              <Route path="/">
                <Home />
              </Route>
            </Switch>
            <RedirectWithSave logged={logged} />
          </main>
        </Router>
      </ThemeProvider>
    </div>

  );
}

function RedirectWithSave(props: { logged: boolean; }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const pathname = useSelector(selectPathname);
  if (props.logged === true && location.pathname === "/auth") {
    if (pathname !== "/auth") {
      return <Redirect to={pathname} />
    }
    return null;
  }
  if (props.logged) {
    return null;
  }
  if (location.pathname !== "/auth") {
    dispatch(setPathName(location.pathname));
    return <Redirect to="/auth" />
  }
  return null;
}

function Home() {
  // Idk what to put here, I'll just redirect to top
  return <Redirect to="/top" />
}

export default App;
