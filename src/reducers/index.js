import { combineReducers } from "redux";
import login from "./login";
import todos from './todo';
import snackbar from './snackbar';

const todoApp = combineReducers({
  todos,
  login,
  snackbar
});

export default todoApp