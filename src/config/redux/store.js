import { combineReducers, createStore } from "redux";
import counterReducer from "../redux/reducers/counterReducer"
import postReducer from "./reducers/posts/stationReducer";

const rootReducer = combineReducers({
    counter: counterReducer,
    post: postReducer,
})

const store = createStore(rootReducer)
export default store