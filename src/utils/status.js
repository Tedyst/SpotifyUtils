import {
    setLogged,
    setPlaylists,
    setUsername,
    setImage,
    setTop,
    setCompare,
    setRecent
} from '../store/user';
import { useDispatch, batch } from 'react-redux';


export default function Update() {
    const dispatch = useDispatch();
    fetch('/api/status').then(res => res.json()).then(data => {
        batch(() => {
            dispatch(setImage(data.image));
            dispatch(setLogged(data.success));
            dispatch(setPlaylists(data.playlists));
            if (!data.username)
                dispatch(setUsername("Not Logged In"));
            else
                dispatch(setUsername(data.username));

            if (!data.success)
                localStorage.clear();
        })
        if (data.success) {
            fetch('/api/top').then(res => res.json()).then(data => {
                dispatch(setTop(data["result"]));
            });
            fetch('/api/compare/').then(res => res.json()).then(data => {
                dispatch(setCompare(data));
            });
            fetch('/api/recent/me').then(res => res.json()).then(data => {
                dispatch(setRecent(data));
            });
        }
    }).catch(err => {
        localStorage.clear();
        console.log(err);
    });
}