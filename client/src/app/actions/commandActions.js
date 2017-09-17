import { ADD_COMMAND, DELETE_COMMAND, SET_COMMAND_LIST } from "./types";

export const setCommandList = value => ({
  type: SET_COMMAND_LIST,
  payload: value,
});

export const addCommand = value => ({
  type: ADD_COMMAND,
  payload: value
});

export const deleteCommand = () => ({
  type: DELETE_COMMAND,
});