import { LAUNCH_CHOOSER, LIST_CHOOSER, SET_CHOOSER } from "./types";

export const set = value => ({
  type: SET_CHOOSER,
  payload: value,
});

export const showList = () => ({
  type: LIST_CHOOSER,
});

export const showLauncher = () => ({
  type: LAUNCH_CHOOSER,
});