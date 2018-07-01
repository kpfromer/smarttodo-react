import { combineReducers } from "redux";
import login from "./login";
import todos from './todo';

const todoApp = combineReducers({
  todos,
  login
});

export default todoApp