import { createSlice } from '@reduxjs/toolkit';
import { loadState, saveState } from './localStorage';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    logged: loadState("logged") ? true : false,
    name: loadState("name") ? loadState("name") : "Not Logged In",
    image: loadState("image") ? loadState("image") : "",
    playlists: loadState("playlists") ? loadState("playlists") : [],
    pathname: loadState("pathname") ? loadState("pathname") : undefined,
    compare: loadState("compare") ? loadState("compare") : {
      "code": "NONE",
      "friends": []
    },
    recent: {
      "results": []
    }
  },
  reducers: {
    setLogged: (state, action) => {
      state.logged = action.payload;
      saveState("logged", action.payload);
    },
    setImage: (state, action) => {
      state.image = action.payload;
      saveState("image", action.payload);
    },
    setUsername: (state, action) => {
      state.name = action.payload;
      saveState("name", action.payload);
    },
    setPlaylists: (state, action) => {
      state.playlists = action.payload;
      saveState("playlists", action.payload);
    },
    setPathName: (state, action) => {
      saveState("pathname", action.payload);
      state.pathname = action.payload;
    },
    setCompare: (state, action) => {
      saveState("compare", action.payload);
      state.compare = action.payload;
    },
    setRecent: (state, action) => {
      saveState("recent", action.payload);
      state.recent = action.payload;
    },
  },
});

export const {
  setLogged,
  setPlaylists,
  setUsername,
  setImage,
  setPathName,
  setCompare,
  setRecent
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
// in the slice file. For example: `useSelector((state) => state.user.value)`
export const selectLogged = (state: any) => state.user.logged;
export const selectPlaylists = (state: any) => state.user.playlists;
export const selectUsername = (state: any) => state.user.name;
export const selectImage = (state: any) => state.user.image;
export const selectPathname = (state: any) => state.user.pathname;
export const selectCompare = (state: any) => state.user.compare;
export const selectRecent = (state: any) => state.user.recent;

export default userSlice.reducer;
