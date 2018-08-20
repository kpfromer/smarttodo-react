import React from 'react';
import ReactDOM from 'react-dom';

import './normalize.css';
import './reset.css';
import './index.css';

import { applyMiddleware, createStore } from 'redux';
import { Provider } from "react-redux";
import Reducers from "./reducers/";

import Raven from 'raven-js';

import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { serverLogout } from "./actions/server-logout";
import api from "./middleware/api/api";
import httpError from './middleware/http-error/http-error';

if (process.env.NODE_ENV === 'production') {
  // Configure sentry io
  Raven
    .config(process.env.REACT_APP_SENTRYIOTOKEN)
    .install();
  // Setup firebase config
  require('./firebase.js');
}

const store = createStore(
  Reducers,
  window.devToolsExtension && window.devToolsExtension(),
  applyMiddleware(
    api({
      getAuthFromState: state => state.login.token
    }),
    httpError([
      {
        statusCode: 401,
        action: serverLogout
      }
    ])
  )
);


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>, document.getElementById('root'));
registerServiceWorker();
