import { createAsyncThunk } from "@reduxjs/toolkit"
import { fetchBusImage } from "../../../../services/Bus/BusApi";
import { fetchBusStation } from "../../../../services/Station/StationApi";

export const fetchPopularBuses = createAsyncThunk(
    'buses/fetchBusPopular',
    async () => {
        const response = await fetchBusImage();
        return response; 
    }
);

export const fetchPopularStations = createAsyncThunk(
    'station/fetchStationPopular',
    async () => {
        const response = await fetchBusStation();
        return response; 
    }
);