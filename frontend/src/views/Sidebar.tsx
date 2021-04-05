import React from 'react';
import {
    CssBaseline,
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
    setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>,
    mobileOpen: boolean,
    logged: boolean,
    username?: string,
    image?: string,
}) {
    const classes = useStyles();
    const theme = useTheme();
    const location = useLocation();
    const { logged, username, image } = props;

    if (!logged) return null;

    const handleDrawerToggle = () => {
        props.setMobileOpen(!props.mobileOpen);
    };

    const drawer = (
        <div>
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
                    onClick={handleDrawerToggle}
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
                    onClick={handleDrawerToggle}
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
                    onClick={handleDrawerToggle}
                    key="TrackSearch"
                    selected={location.pathname === '/tracksearch'}
                    to="/tracksearch"
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
                    onClick={handleDrawerToggle}
                    key="Compare"
                    selected={location.pathname.startsWith('/compare')}
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
                    onClick={handleDrawerToggle}
                    key="Recent-Tracks"
                    selected={location.pathname.startsWith('/recent')}
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
                    onClick={handleDrawerToggle}
                    key="old-top"
                    selected={location.pathname.startsWith('/listeningstatistics')}
                    to="/listeningstatistics"
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
                    onClick={handleDrawerToggle}
                    key="settings"
                    selected={location.pathname.startsWith('/settings')}
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
                    onClick={handleDrawerToggle}
                    key="logout"
                    selected={location.pathname.startsWith('/logout')}
                    to="/logout"
                >
                    <ListItemIcon>
                        <ExitToApp />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItem>
            </List>
        </div>
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

    const { mobileOpen } = props;
    return (
        <div className={classes.root}>
            <CssBaseline />
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
};

export default ResponsiveDrawer;
