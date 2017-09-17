import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap';

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from 'react-redux';

import store from "./store";
import App from "./app/App";

ReactDOM.render(
  <Provider store={store} key="provider">
    <App />
  </Provider>,
  document.getElementById('root'),
);