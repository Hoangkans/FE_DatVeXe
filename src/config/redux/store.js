import { configureStore } from '@reduxjs/toolkit';

import postReducer from "../redux/reducers/posts/postSlice"; 
import busSlice from "../redux/reducers/Bus/busSlice";
import stationSlice from '../redux/reducers/Bus/stationSlice';
import userSlice from './reducers/user/userSlice';
const store = configureStore({
    reducer: {
        post: postReducer, 
        buses: busSlice,
        stations: stationSlice,
        user: userSlice,
    },
});

export default store;