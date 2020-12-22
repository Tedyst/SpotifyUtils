import { configureStore, Action } from '@reduxjs/toolkit'
import { ThunkAction } from 'redux-thunk'

import userReducer from './user';

const store = configureStore({
  reducer: {
    user: userReducer,
  }
});

export type AppDispatch = typeof store.dispatch

export type AppThunk = ThunkAction<void, unknown, unknown, Action<string>>

export default store