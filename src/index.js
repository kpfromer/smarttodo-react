import React from 'react';
import ReactDOM from 'react-dom';

import './normalize.css';
import './reset.css';
import './index.css';

import { applyMiddleware, createStore } from 'redux';
import { Provider } from "react-redux";
import Reducers from "./reducers/";

import App from './App';
import registerServiceWorker from './registerServiceWorker';
import api from "./middleware/api/api";

const store = createStore(
  Reducers,
  window.devToolsExtension && window.devToolsExtension(),
  applyMiddleware(
    api({
      getAuthFromState: state => state.login.token
    })
  )
);


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>, document.getElementById('root'));
registerServiceWorker();
