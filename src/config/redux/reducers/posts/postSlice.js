import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    posts: [],
    selectedPost: null,
};

const postsSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        setSelectedPost(state, action) {
            state.selectedPost = action.payload;
        },
        setPosts(state, action) {
            state.posts = action.payload;
        },
    },
});

export const { setSelectedPost, setPosts } = postsSlice.actions;
export default postsSlice.reducer;
