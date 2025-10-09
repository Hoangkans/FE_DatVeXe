const initialState = {
    stations: [],           
    selectedStation: null,  
};

export default function stationReducer(state = initialState, action) {
    switch (action.type) {
        case "SET_SELECTED_STATION":
            return { ...state, selectedStation: action.payload };
        case "SET_STATIONS":
            return { ...state, stations: action.payload };
        default:
            return state;
    }
}
