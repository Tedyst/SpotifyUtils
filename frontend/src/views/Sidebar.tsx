import React from 'react';
import {
    Divider,
    Drawer,
    Hidden,
    List,
    IconButton,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    makeStyles,
    useTheme,
    AppBar,
    Avatar,
} from '@material-ui/core';
import {
    Search, AllInclusive, Settings, SupervisorAccount, History, ExitToApp, QueueMusic, Menu,
} from '@material-ui/icons';
import ListIcon from '@material-ui/icons/List';
import { Link, useLocation } from 'react-router-dom';
import { Settings as SettingsInterface } from '../components/Settings/SettingsPage';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appBar: {
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
        },
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    toolbarName: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        marginRight: 10,
    },
    selected: {
        backgroundColor: `${theme.palette.primary.main}!important`,
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

function ResponsiveDrawer(props: {
    logged: boolean,
    username?: string,
    image?: string,
    settings?: SettingsInterface,
}) {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const classes = useStyles();
    const theme = useTheme();
    const location = useLocation();
    const {
        logged,
        username,
        image,
        settings,
    } = props;

    if (!logged) return null;

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const closeDrawer = () => {
        setMobileOpen(false);
    };

    const drawer = (
        <>
            <div className={`${classes.toolbar} ${classes.toolbarName}`}>
                <Typography variant="h5" noWrap>
                    Utils For Spotify
                </Typography>
            </div>
            <Divider />
            <List>
                <ListItem
                    button
                    classes={{
                        selected: classes.selected,
                    }}
                    component={Link}
                    onClick={closeDrawer}
                    key="Top"
                    selected={location.pathname === '/'}
                    to="/"
                >
                    <ListItemIcon>
                        <AllInclusive />
                    </ListItemIcon>
                    <ListItemText primary="Your Top" />
                </ListItem>
                <ListItem
                    button
                    classes={{
                        selected: classes.selected,
                    }}
                    component={Link}
                    onClick={closeDrawer}
                    key="Playlist"
                    selected={location.pathname === '/playlist'}
                    to="/playlist"
                >
                    <ListItemIcon>
                        <ListIcon />
                    </ListItemIcon>
                    <ListItemText primary="Playlist" />
                </ListItem>
                <ListItem
                    button
                    classes={{
                        selected: classes.selected,
                    }}
                    component={Link}
                    onClick={closeDrawer}
                    key="TrackSearch"
                    selected={location.pathname.startsWith('/track')}
                    to="/track"
                >
                    <ListItemIcon>
                        <Search />
                    </ListItemIcon>
                    <ListItemText primary="Search Tracks" />
                </ListItem>
                <ListItem
                    button
                    classes={{
                        selected: classes.selected,
                    }}
                    component={Link}
                    onClick={closeDrawer}
                    key="Compare"
                    selected={location.pathname?.startsWith('/compare')}
                    to="/compare"
                >
                    <ListItemIcon>
                        <SupervisorAccount />
                    </ListItemIcon>
                    <ListItemText primary="Compare" />
                </ListItem>
                <ListItem
                    button
                    classes={{
                        selected: classes.selected,
                    }}
                    component={Link}
                    onClick={closeDrawer}
                    key="Recent-Tracks"
                    selected={location.pathname?.startsWith('/recent')}
                    to="/recent"
                >
                    <ListItemIcon>
                        <QueueMusic />
                    </ListItemIcon>
                    <ListItemText primary="Recent Tracks" />
                </ListItem>
                <ListItem
                    button
                    classes={{
                        selected: classes.selected,
                    }}
                    component={Link}
                    onClick={closeDrawer}
                    key="old-top"
                    selected={location.pathname?.startsWith('/listeningstatistics')}
                    to="/listeningstatistics"
                    disabled={!settings?.RecentTracks}
                >
                    <ListItemIcon>
                        <History />
                    </ListItemIcon>
                    <ListItemText primary="Listening Statistics" />
                </ListItem>
                <ListItem
                    button
                    classes={{
                        selected: classes.selected,
                    }}
                    component={Link}
                    onClick={closeDrawer}
                    key="settings"
                    selected={location.pathname?.startsWith('/settings')}
                    to="/settings"
                >
                    <ListItemIcon>
                        <Settings />
                    </ListItemIcon>
                    <ListItemText primary="Settings" />
                </ListItem>
                <ListItem
                    button
                    classes={{
                        selected: classes.selected,
                    }}
                    component={Link}
                    onClick={closeDrawer}
                    key="logout"
                    selected={location.pathname?.startsWith('/logout')}
                    to="/logout"
                >
                    <ListItemIcon>
                        <ExitToApp />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItem>
            </List>
        </>
    );

    const container = window !== undefined ? () => window.document.body : undefined;

    const avatar = (
        <Avatar
            className={classes.avatar}
            src={image}
        />
    );

    const header = (
        <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    className={classes.menuButton}
                >
                    <Menu />
                </IconButton>
                {avatar}
                <Typography variant="h6" noWrap>
                    {username}
                </Typography>
            </Toolbar>
        </AppBar>
    );

    return (
        <div className={classes.root}>
            {header}
            <nav className={classes.drawer} aria-label="mailbox folders">
                <Hidden smUp implementation="css">
                    <Drawer
                        container={container}
                        variant="temporary"
                        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true,
                        }}
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                    <Drawer
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        variant="permanent"
                        open
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
            </nav>
        </div>
    );
}

ResponsiveDrawer.defaultProps = {
    username: 'Not logged in',
    image: '',
    settings: {
        RecentTracks: true,
    },
};

export default ResponsiveDrawer;
