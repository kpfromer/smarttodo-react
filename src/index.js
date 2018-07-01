import React from 'react';
import ReactDOM from 'react-dom';

import './normalize.scss';
import './reset.scss';
import './index.scss';

import { createStore } from 'redux';
import { Provider } from "react-redux";
import Reducers from "./reducers/";

import App from './App';
import registerServiceWorker from './registerServiceWorker';

const store = createStore(
  Reducers,
  window.devToolsExtension && window.devToolsExtension()
);


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>, document.getElementById('root'));
registerServiceWorker();
