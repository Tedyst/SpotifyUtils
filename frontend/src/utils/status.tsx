import {
    setLogged,
    setPlaylists,
    setUsername,
    setImage,
    setCompare,
    setCSRFToken,
} from "../store/user";
import { batch } from "react-redux";
import store from "../store/store";

export default function UpdateUser() {
    fetch("/api/status", { cache: "no-store", credentials: "same-origin" })
        .then((res) => {
            store.dispatch(setCSRFToken(res.headers.get("X-CSRF-Token")))
            return res.json()
        })
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
                fetch("/api/compare", { cache: "no-store", credentials: "same-origin" })
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
