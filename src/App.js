import React, { Component, Fragment } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
//styles
import './App.scss';

import { Header } from "./components/Header/Header";
import TodoList from "./containers/TodoList/TodoList";
import NotFound from "./components/NotFound/NotFound";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Fragment>
          <Header />
          <div className="container">
            <Switch>
              <Route exact path="/" component={TodoList} />
              <Route component={NotFound} />
            </Switch>
          </div>
        </Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
