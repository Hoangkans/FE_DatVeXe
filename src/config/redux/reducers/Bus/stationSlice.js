import { fetchPopularStations } from "../../thunks/Bus/Popular";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: [],
    status: 'idle',
    error: null
}

export const stationSlice = createSlice({
    name: 'stations',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder 
            .addCase(fetchPopularStations.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchPopularStations.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.data = action.payload.data;
                console.log(action.payload.data)
            })
            .addCase(fetchPopularStations.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
    }
})

export default stationSlice.reducer