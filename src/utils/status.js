import {
  setLogged,
  setPlaylists,
  setUsername,
  setImage,
  setTop,
  setCompare
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
    fetch('/compare/').then(res => res.json()).then(data => {
        dispatch(setCompare(data));
    });
}