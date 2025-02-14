import { combineReducers } from "redux";
import friendsReducer from "./friendsReducer.js";
import teamsReducer from "./teamsReducer.js";
import userReducer from "./userReducer.js";

const rootReducer=combineReducers({
          user: userReducer,
          friends: friendsReducer,
          teams: teamsReducer
})
export default rootReducer;