import { createSlice } from "@reduxjs/toolkit";

const loadUserFromStorage = () => {
    try {
        const userInfo = localStorage.getItem('user')
        if (userInfo === null){
            return null;
        }
        return JSON.parse(userInfo)
    }catch(err){
        console.log("Could not load user from local storage", err)
        return null;
    }
}

const loadedUser = loadUserFromStorage();

const initialState = {
    userInfo: loadedUser,
    status: loadedUser ? 'succeeded' : 'idle',
    error: null
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        changeName(state, action ) {
            state.userInfo = action.payload
            state.status = 'succeeded'
        },
        logOut(state){
            localStorage.removeItem('user')
            localStorage.removeItem('token')
            state.userInfo = null
            state.status = 'idle'
        }
    }
})

export const { changeName, logOut } = userSlice.actions;
export default userSlice.reducer