import { LIST_CHOOSER, LAUNCH_CHOOSER, SET_CHOOSER } from '../actions/types';

export default (state = false, action = {}) => {
  switch (action.type) {
    case SET_CHOOSER:
      return action.payload;
    case LIST_CHOOSER:
      return false;
    case LAUNCH_CHOOSER:
      return true;
    default:
      return state;
  }
};