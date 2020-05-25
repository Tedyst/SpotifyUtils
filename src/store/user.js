import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    logged: Cookies.get("logged"),
    name: "Not Logged In",
    image: "",
    playlists: [],
    top: {
      "artists": {},
      "tracks": {},
      "genres": {}
    }
  },
  reducers: {
    setLogged: (state, action) => {
      state.logged = action.payload;
    },
    setImage: (state, action) => {
      state.image = action.payload;
    },
    setUsername: (state, action) => {
      state.name = action.payload;
    },
    setPlaylists: (state, action) => {
      state.playlists = action.payload;
    },
    setTop: (state, action) => {
      state.top = action.payload;
    }
  },
});

export const {
  setLogged, 
  setPlaylists,
  setUsername,
  setImage,
  setTop
} = userSlice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
// export const incrementAsync = amount => dispatch => {
//   setTimeout(() => {
//     dispatch(incrementByAmount(amount));
//   }, 1000);
// };

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectLogged = state => state.counter.logged;
export const selectPlaylists = state => state.counter.playlists;
export const selectUsername = state => state.counter.name;
export const selectImage = state => state.counter.image;
export const selectTop = state => state.counter.top;

export default userSlice.reducer;
