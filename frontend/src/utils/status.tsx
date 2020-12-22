import {
    setLogged,
    setPlaylists,
    setUsername,
    setImage,
    setCompare,
} from "../store/user";
import { batch } from "react-redux";
import store from "../store/store";

export default function UpdateUser() {
    
    fetch("/api/status", { cache: "no-store" })
        .then((res) => res.json())
        .then((data) => {
            batch(() => {
                store.dispatch(setImage(data.image));
                store.dispatch(setLogged(data.success));
                store.dispatch(setPlaylists(data.playlists));
                if (!data.username) store.dispatch(setUsername("Not Logged In"));
                else store.dispatch(setUsername(data.username));

                if (!data.success) localStorage.clear();
            });
            if (data.success) {
                fetch("/api/compare", { cache: "no-store" })
                    .then((res) => res.json())
                    .then((data) => {
                        store.dispatch(setCompare(data));
                    });
            }
        })
        .catch((err) => {
            localStorage.clear();
            console.log(err);
        });
}
