import { SET_COMMAND_LIST, DELETE_COMMAND, ADD_COMMAND } from '../actions/types';

export default (state = [], action = {}) => {
  switch (action.type) {
    case SET_COMMAND_LIST:
      return action.payload;
    case ADD_COMMAND:
      return [
          ...state,
          action.payload
        ];
    case DELETE_COMMAND:
      return [];
    default:
      return state;
  }
};