import {SET_COMMAND_LIST, DELETE_COMMAND, ADD_COMMAND, UPDATE_COMMAND} from '../actions/types';

export default (state = [], action = {}) => {
  switch (action.type) {
    case SET_COMMAND_LIST:
      return action.payload;
    case ADD_COMMAND:
      return [
          ...state,
          action.payload
        ];
    case UPDATE_COMMAND:
      const ind = state.findIndex(el => el.key === action.payload.job);
      const el = state[ind];
      el.tasks = action.payload.tasks;
      el.task = action.payload.taskId;
      el.percent = action.payload.percent;
      return [
        ...state.slice(0,ind),
        el,
        ...state.slice(ind+1),
      ];
    case DELETE_COMMAND:
      return [];
    default:
      return state;
  }
};