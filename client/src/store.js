import { createStore, applyMiddleware } from "redux";
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import rootReducer from './rootReducer';
import io from 'socket.io-client';
import {setCommandList, updateCommand} from './app/actions/commandActions';
const socket = io.connect();

const store = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(thunk),
  )
);

socket.on('connect', () => {
  console.log('Connected');
});
socket.on('task-progress', (msg) => {
  store.dispatch(updateCommand(msg));
});
socket.on('task-executed', (msg) => {
  store.dispatch(setCommandList(msg._data));
});

export default store;