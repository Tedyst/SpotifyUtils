import React from "react";
import Login from "./views/Login";
import PlaylistView from "./views/PlaylistView";
import Track from "./views/Track";
import Logout from "./views/Logout";
import Recent from "./views/Recent";
import Settings from "./views/Settings";
import Top from "./views/Top";
import Compare from "./views/Compare";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useLocation,
} from "react-router-dom";
import Sidebar from "./views/Sidebar";
import { createMuiTheme, makeStyles, ThemeProvider } from "@material-ui/core";
import TrackSearch from "./views/TrackSearch";
import { useSwipeable } from "react-swipeable";
import OldTop from "./views/OldTop";
import axios from "axios";
import { useQuery } from "react-query";
import ServiceWorkerPopup from "./components/ServiceWorkerPopup";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
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
export interface StatusInterface {
  success: boolean;
  username: string;
  image: string;
  playlists: Playlist[];
}

export interface Playlist {
  id: string;
  name: string;
}

function App() {
  const darkTheme = createMuiTheme({
    palette: {
      type: "dark",
    },
  });
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handlers = useSwipeable({
    trackMouse: false,
    onSwipedRight: () => setMobileOpen(true),
  });

  return (
    <div className={classes.root} {...handlers}>
      <ThemeProvider theme={darkTheme}>
        <Router>
          <Sidebar
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
          />
          <main className={classes.content}>
            <div className={classes.toolbar} />
            <Switch>
              <Route path="/auth">
                <Login />
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
              <Route path="/settings">
                <Settings />
              </Route>
              <Route path="/logout">
                <Logout />
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
            <RedirectToAuth />
            <ServiceWorkerPopup />
          </main>
        </Router>
      </ThemeProvider>
    </div>
  );
}

function RedirectToAuth() {
  const { data } = useQuery('status', () =>
    axios.get<StatusInterface>('/api/status', {
      withCredentials: true
    }))
  let logged = data?.data.success;
  const location = useLocation();
  const pathname = location.pathname;
  if (!logged && pathname !== "/auth") {
    return <Redirect to="/auth" />
  }
  if (logged && pathname === "/auth") {
    return <Redirect to="/" />
  }
  return null;
}

function Home() {
  // Idk what to put here, I'll just redirect to top
  return <Redirect to="/top" />;
}

export default App;
