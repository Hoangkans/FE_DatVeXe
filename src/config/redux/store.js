import { combineReducers, createStore } from "redux";
import counterReducer from "../redux/reducers/counterReducer"
import stationReducer from "./reducers/station/stationreducer";

const rootReducer = combineReducers({
    counter: counterReducer,
    station: stationReducer,
})

const store = createStore(rootReducer)
export default store