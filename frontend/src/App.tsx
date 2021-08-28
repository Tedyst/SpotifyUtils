import React, { lazy, Suspense } from 'react';
import {
    Switch,
    Route,
    Redirect,
} from 'react-router-dom';
import {
    createTheme,
    CssBaseline,
    makeStyles,
    ThemeProvider,
} from '@material-ui/core';
import axios from 'axios';
import { useQuery } from 'react-query';
import { setUser as SentrySetUser } from '@sentry/react';
import ServiceWorkerPopup from './components/ServiceWorkerPopup';
import { Settings as SettingsInterface } from './components/Settings/SettingsPage';

import Sidebar from './views/Sidebar';
import Loading from './components/Loading';
import Login from './views/Auth/Login';

const Share = lazy(() => import('./views/SharePage'));
const PlaylistView = lazy(() => import('./views/PlaylistView'));
const Track = lazy(() => import('./views/TrackPage'));
const Logout = lazy(() => import('./views/Auth/Logout'));
const Recent = lazy(() => import('./views/RecentPage'));
const Settings = lazy(() => import('./views/SettingsPage'));
const Top = lazy(() => import('./views/TopPage'));
const Compare = lazy(() => import('./views/ComparePage'));
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
    const darkTheme = createTheme({
        palette: {
            type: 'dark',
        },
    });
    const classes = useStyles();

    const { data } = useQuery('status', () => axios.get<StatusInterface>('/api/status', {
        withCredentials: true,
    }));
    const logged = data?.data?.Success;
    axios.defaults.headers.post['X-CSRF-Token'] = data?.headers['x-csrf-token'];

    if (!logged) {
        if (window.location.pathname !== '/' && window.location.pathname !== '/auth' && window.location.pathname !== '/logout') {
            window.localStorage.setItem('lastURL', window.location.pathname);
        }
        return (
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <Suspense fallback={null}>
                    <div className={classes.root}>
                        <main className={classes.content}>
                            <div className={classes.toolbar} />
                            <Login
                                CSRFToken={data?.headers['x-csrf-token']}
                            />
                        </main>
                    </div>
                    <ServiceWorkerPopup />
                </Suspense>
            </ThemeProvider>
        );
    }

    SentrySetUser({
        id: data?.data?.ID,
    });

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <div className={classes.root}>
                <Suspense fallback={null}>
                    <Sidebar
                        logged={!!data?.data?.Success}
                        username={data?.data?.Username}
                        image={data?.data?.Image}
                        settings={data?.data?.Settings}
                    />
                </Suspense>
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    <Switch>
                        <Route path="/playlist">
                            <Suspense fallback={<Loading />}>
                                <PlaylistView
                                    playlists={data?.data.Playlists}
                                />
                            </Suspense>
                        </Route>
                        <Route path="/listeningstatistics">
                            <Suspense fallback={<Loading />}>
                                <ListeningStats />
                            </Suspense>
                        </Route>
                        <Route path="/compare">
                            <Suspense fallback={<Loading />}>
                                <Compare />
                            </Suspense>
                        </Route>
                        <Route path="/track">
                            <Suspense fallback={<Loading />}>
                                <Track />
                            </Suspense>
                        </Route>
                        <Route path="/recent">
                            <Suspense fallback={<Loading />}>
                                <Recent />
                            </Suspense>
                        </Route>
                        <Route path="/settings">
                            <Suspense fallback={<Loading />}>
                                <Settings />
                            </Suspense>
                        </Route>
                        <Route path="/share">
                            <Suspense fallback={<Loading />}>
                                <Share />
                            </Suspense>
                        </Route>
                        <Route path="/logout">
                            <Suspense fallback={<Loading />}>
                                <Logout />
                            </Suspense>
                        </Route>
                        <Route path="/auth">
                            <Suspense fallback={<Loading />}>
                                <Redirect to="/" />
                            </Suspense>
                        </Route>
                        <Route path="/">
                            <Suspense fallback={<Loading />}>
                                <Top />
                            </Suspense>
                        </Route>
                    </Switch>
                </main>

                <Suspense fallback={null}>
                    <ServiceWorkerPopup />
                </Suspense>
            </div>
        </ThemeProvider>
    );
}

export default App;
