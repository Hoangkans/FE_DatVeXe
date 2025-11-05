import { configureStore } from '@reduxjs/toolkit';

import postReducer from "../redux/reducers/posts/postSlice"; 
import busSlice from "../redux/reducers/Bus/busSlice";
import stationSlice from '../redux/reducers/Bus/stationSlice';

const store = configureStore({
    reducer: {
        post: postReducer, 
        buses: busSlice,
        stations: stationSlice
    },
});

export default store;