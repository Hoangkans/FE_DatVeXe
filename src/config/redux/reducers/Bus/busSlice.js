import { fetchPopularBuses } from "../../thunks/Bus/Popular";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: [],
    status: 'idle',
    error: null
}

export const busSlice = createSlice({
    name: 'buses',
    initialState,
    reducers: {
        clearSlide(state, action) {
            state.data = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPopularBuses.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchPopularBuses.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchPopularBuses.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message;
            })
    }
})

export default busSlice.reducer