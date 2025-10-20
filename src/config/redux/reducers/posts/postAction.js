export const setSelectedPost = (post) => ({
    type: "SET_SELECTED_POST",
    payload: post,
});

export const setPosts = ([posts]) => ({
    type: "SET_POSTS",
    payload: posts,
});
