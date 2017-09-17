import { combineReducers } from 'redux';
import viewChooser from "./app/reducers/viewChooser";
import commands from "./app/reducers/commands";

export default combineReducers({
  viewChooser,
  commands
});