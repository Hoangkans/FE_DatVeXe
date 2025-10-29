import { configureStore } from '@reduxjs/toolkit';

import postReducer from "../redux/reducers/posts/postSlice"; 

const store = configureStore({
    reducer: {
        post: postReducer, 
    },
});

export default store;