import {
  setLogged,
  selectLogged,
  setPlaylists,
  setUsername,
  setImage,
  setPathName,
  selectPathname,
  setTop
} from '../store/user';
import { useDispatch, batch } from 'react-redux';


export default function Update(){
    const dispatch = useDispatch();
    fetch('/status').then(res => res.json()).then(data => {
        batch(() => {
            dispatch(setImage(data.image));
            dispatch(setLogged(data.logged));
            dispatch(setPlaylists(data.playlists));
            if(!data.username)
            dispatch(setUsername("Not Logged In"));
            else
            dispatch(setUsername(data.username));
        })
    });
    fetch('/top/me').then(res => res.json()).then(data => {
        dispatch(setTop(data));
    });
}