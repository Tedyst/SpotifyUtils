import React from 'react';
import PropTypes from 'prop-types';
import { CssBaseline, Divider, Drawer, Hidden, List, IconButton, ListItem, ListItemIcon, ListItemText, Toolbar, Typography, makeStyles, useTheme, AppBar, Avatar } from '@material-ui/core';
import { Search, AllInclusive, Settings, SupervisorAccount, History, ExitToApp, QueueMusic, Menu } from '@material-ui/icons';
import ListIcon from '@material-ui/icons/List';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { StatusInterface } from '../App';

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
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    avatar: {
        marginRight: 10,
    },
    selected: {
        backgroundColor: theme.palette.primary.main + "!important",
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
    window: any,
}) {
    const { window } = props;
    const classes = useStyles();
    const theme = useTheme();
    const location = useLocation();
    const [lastLocation, setLastLocation] = React.useState(location);

    const { data } = useQuery('status', () =>
        axios.get<StatusInterface>('/api/status', {
            withCredentials: true
        }))
    const username = data?.data.username === undefined ? "Not logged in" : data.data.username;
    const image = data?.data.image === undefined ? "" : data.data.image;
    const logged = data?.data.success === undefined ? false : data?.data.success;

    if (!logged)
        return null;
    if (location !== lastLocation) {
        setLastLocation(location);
        props.setMobileOpen(false);
    }
    const handleDrawerToggle = () => {
        props.setMobileOpen(!props.mobileOpen);
    };

    const drawer = (
        <div>
            <div className={`${classes.toolbar} ${classes.toolbarName}`} >
                <Typography variant="h5" noWrap>
                    Utils For Spotify
                </Typography>
            </div>
            <Divider />
            <List>
                <ListItem button key="Top" component={Link} to="/" selected={location.pathname === "/"} classes={{
                    selected: classes.selected,
                }}>
                    <ListItemIcon>
                        <AllInclusive />
                    </ListItemIcon>
                    <ListItemText primary="Your Top" />
                </ListItem>
                <ListItem button key="Playlist" component={Link} to="/playlist" selected={location.pathname === "/playlist"} classes={{
                    selected: classes.selected,
                }}>
                    <ListItemIcon>
                        <ListIcon />
                    </ListItemIcon>
                    <ListItemText primary="Playlist" />
                </ListItem>
                <ListItem button key="TrackSearch" component={Link} to="/tracksearch" selected={location.pathname === "/tracksearch"} classes={{
                    selected: classes.selected,
                }}>
                    <ListItemIcon>
                        <Search />
                    </ListItemIcon>
                    <ListItemText primary="Search Tracks" />
                </ListItem>
                <ListItem button key="Compare" component={Link} to="/compare" selected={location.pathname.startsWith("/compare")} classes={{
                    selected: classes.selected,
                }}>
                    <ListItemIcon>
                        <SupervisorAccount />
                    </ListItemIcon>
                    <ListItemText primary="Compare" />
                </ListItem>
                <ListItem button key="Recent-Tracks" component={Link} to="/recent" selected={location.pathname.startsWith("/recent")} classes={{
                    selected: classes.selected,
                }}>
                    <ListItemIcon>
                        <QueueMusic />
                    </ListItemIcon>
                    <ListItemText primary="Recent Tracks" />
                </ListItem>
                <ListItem button key="old-top" component={Link} to="/listeningstatistics" selected={location.pathname.startsWith("/listeningstatistics")} classes={{
                    selected: classes.selected,
                }}>
                    <ListItemIcon>
                        <History />
                    </ListItemIcon>
                    <ListItemText primary="Listening Statistics" />
                </ListItem>
                <ListItem button key="settings" component={Link} to="/settings" selected={location.pathname.startsWith("/settings")} classes={{
                    selected: classes.selected,
                }}>
                    <ListItemIcon>
                        <Settings />
                    </ListItemIcon>
                    <ListItemText primary="Settings" />
                </ListItem>
                <ListItem button key="logout" component={Link} to="/logout" selected={location.pathname.startsWith("/logout")} classes={{
                    selected: classes.selected,
                }}>
                    <ListItemIcon>
                        <ExitToApp />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItem>
            </List>
        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    const avatar = <Avatar
        className={classes.avatar}
        src={image}
    />;

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
    )

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
                        open={props.mobileOpen}
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

ResponsiveDrawer.propTypes = {
    window: PropTypes.func,
};

export default ResponsiveDrawer;
