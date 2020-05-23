import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Select, MenuItem, TextField, Grid } from '@material-ui/core';
import {
  selectPlaylists
} from '../store/user';
import { useSelector, useDispatch } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  fullWidth: {
    width: '100%'
  },
  grid: {
    width: '100%',
    marginTop: '10px'
  }
}));

export default function PlaylistView() {
    const classes = useStyles();
    const playlists = useSelector(selectPlaylists);
    const dispatch = useDispatch();

    let idk = [];
    if(playlists !== undefined){
      for(var key in playlists) {
        idk.push(
          <MenuItem
            value={key}
            key={key}
            className={classes.fullWidth} >
                {playlists[key]}
          </MenuItem>
        );
      };
    }
    const [selectedPlaylist, setselectedPlaylist] = React.useState('none');
    const changePlaylist = (event) => {
      setselectedPlaylist(event.target.value);
    };

    return (
        <Container>
            <CssBaseline />
            <div className={classes.paper}>
              <Grid container spacing={2}>
                <form className={classes.form} noValidate>
                  <Typography variant="body2" color="textPrimary" align="center">
                      Here are all of your playlists:
                  </Typography>
                  <Select
                    onChange={changePlaylist}
                    value={selectedPlaylist}
                    displayEmpty
                    autoWidth={true}
                    className={classes.grid}
                    variant="outlined"
                  >
                    <MenuItem value="none" disabled>
                      Select a playlist to search into
                    </MenuItem>
                    {idk}
                  </Select>
                  <TextField
                    id="standard-basic"
                    label="Words to search"
                    variant="outlined"
                    className={classes.grid} />
                  <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                  >
                      Search
                  </Button>
                </form>
                </Grid>
            </div>
        </Container>
    )
}

