const initialState = {
    posts: [],           
    selectedPost: null,  
};

export default function postReducer(state = initialState, action) {
    switch (action.type) {
        case "SET_SELECTED_POST":
            return { ...state, selectedPost: action.payload };
        case "SET_POSTS":
            return { ...state, posts: action.payload };
        default:
            return state;
    }
}
