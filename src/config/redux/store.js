import { combineReducers, createStore } from "redux";
import counterReducer from "../redux/reducers/counterReducer"

const rootReducer = combineReducers({
    counter: counterReducer,
})

const store = createStore(rootReducer)
export default store