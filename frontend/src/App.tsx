import React, { lazy, Suspense } from 'react';
import {
    Switch,
    Route,
    Redirect,
} from 'react-router-dom';
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core';
import { useSwipeable } from 'react-swipeable';
import axios from 'axios';
import { useQuery } from 'react-query';
import { setUser as SentrySetUser } from '@sentry/react';
import Sidebar from './views/Sidebar';
import ServiceWorkerPopup from './components/ServiceWorkerPopup';
import RedirectToSaved from './components/RedirectToSaved';
import Loading from './components/Loading';
import { Settings as SettingsInterface } from './components/Settings/SettingsPage';

const Login = lazy(() => import('./views/Auth/Login'));
const PlaylistView = lazy(() => import('./views/PlaylistView'));
const Track = lazy(() => import('./views/TrackPage'));
const Logout = lazy(() => import('./views/Auth/Logout'));
const Recent = lazy(() => import('./views/RecentPage'));
const Settings = lazy(() => import('./views/SettingsPage'));
const Top = lazy(() => import('./views/TopPage'));
const Compare = lazy(() => import('./views/ComparePage'));
const TrackSearch = lazy(() => import('./views/TrackSearch'));
const ListeningStats = lazy(() => import('./views/ListeningStatsPage'));

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
export interface StatusInterface {
    Success: boolean;
    Username: string;
    Image: string;
    Playlists: Playlist[];
    ID: string;
    Settings: SettingsInterface;
    Error?: string;
}

export interface Playlist {
    ID: string;
    Name: string;
}

function App() {
    const darkTheme = createMuiTheme({
        palette: {
            type: 'dark',
        },
    });
    const classes = useStyles();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const handlers = useSwipeable({
        trackMouse: false,
        onSwipedRight: () => setMobileOpen(true),
    });

    const { data } = useQuery('status', () => axios.get<StatusInterface>('/api/status', {
        withCredentials: true,
    }));
    const logged = data?.data.Success;
    axios.defaults.headers.post['X-CSRF-Token'] = data?.headers['x-csrf-token'];

    if (!logged) {
        if (window.location.pathname !== '/' && window.location.pathname !== '/auth' && window.location.pathname !== '/logout') {
            window.localStorage.setItem('lastURL', window.location.pathname);
        }
        return (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <div className={classes.root} {...handlers}>
                <ThemeProvider theme={darkTheme}>
                    <Sidebar
                        mobileOpen={mobileOpen}
                        setMobileOpen={setMobileOpen}
                        logged={false}
                        username="Not logged in"
                        image=""
                        settings={data?.data.Settings}
                    />
                    <Suspense fallback={<Loading />}>
                        <main className={classes.content}>
                            <div className={classes.toolbar} />
                            <Switch>
                                <Route path="/auth">
                                    <Login />
                                </Route>
                                <Route path="/">
                                    <Redirect to="/auth" />
                                </Route>
                            </Switch>
                            <ServiceWorkerPopup />
                        </main>
                    </Suspense>
                </ThemeProvider>
            </div>
        );
    }

    SentrySetUser({
        id: data?.data.ID,
    });

    return (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <div className={classes.root} {...handlers}>
            <ThemeProvider theme={darkTheme}>
                <Sidebar
                    mobileOpen={mobileOpen}
                    setMobileOpen={setMobileOpen}
                    logged={!!data?.data.Success}
                    username={data?.data.Username}
                    image={data?.data.Image}
                    settings={data?.data.Settings}
                />
                <Suspense fallback={<Loading />}>
                    <main className={classes.content}>
                        <div className={classes.toolbar} />
                        <Switch>
                            <Route path="/playlist">

                                <PlaylistView />
                            </Route>
                            <Route path="/tracksearch">
                                <TrackSearch />
                            </Route>
                            <Route path="/listeningstatistics">
                                <ListeningStats />
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
                            <Route path="/auth">
                                <Redirect to="/" />
                            </Route>
                            <Route path="/">
                                <Top />
                            </Route>
                        </Switch>
                        <RedirectToSaved />
                        <ServiceWorkerPopup />
                    </main>
                </Suspense>
            </ThemeProvider>
        </div>
    );
}

export default App;
