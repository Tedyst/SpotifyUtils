import React from 'react';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    selectLogged,
} from '../store/user';

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

function ResponsiveDrawer(props) {
    const { window } = props;
    const classes = useStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const location = useLocation();
    const [lastLocation, setLastLocation] = React.useState(location);
    const logged = useSelector(selectLogged);

    if(!logged)
        return null;
    if(location !== lastLocation){
        setLastLocation(location);
        setMobileOpen(false);
    }
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <div>
        <div className={`${classes.toolbar} ${classes.toolbarName}`} >
            <Typography variant="h6" noWrap className={classes.toolbarName}>
                Spotify Utils
            </Typography>
        </div>
        <Divider />
        <List>
            <ListItem button key="Home" component={Link} to="/" selected={location.pathname === "/"}>
                <ListItemIcon>
                    <MailIcon />
                </ListItemIcon>
                <ListItemText primary="Home" />
            </ListItem>
            <ListItem button key="PlaylistSearch" component={Link} to="/playlistsearch" selected={location.pathname === "/playlistsearch"}>
                <ListItemIcon>
                    <MailIcon />
                </ListItemIcon>
                <ListItemText primary="PlaylistSearch" />
            </ListItem>
            <ListItem button key="Lyrics" component={Link} to="/lyrics" selected={location.pathname === "/lyrics"}>
                <ListItemIcon>
                    <MailIcon />
                </ListItemIcon>
                <ListItemText primary="Lyrics from Playlist" />
            </ListItem>
            <ListItem button key="Top" component={Link} to="/top" selected={location.pathname === "/top"}>
                <ListItemIcon>
                    <MailIcon />
                </ListItemIcon>
                <ListItemText primary="Your Top" />
            </ListItem>
            <ListItem button key="Compare" component={Link} to="/compare" selected={location.pathname.startsWith("/compare")}>
                <ListItemIcon>
                    <MailIcon />
                </ListItemIcon>
                <ListItemText primary="Compare" />
            </ListItem>
        </List>
        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    const avatar = <Avatar 
            className={classes.avatar}
            src={props.image}
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
                    <MenuIcon />
                </IconButton>
                {avatar}
                <Typography variant="h6" noWrap>
                    {props.username}
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

ResponsiveDrawer.propTypes = {
    window: PropTypes.func,
};

export default ResponsiveDrawer;
