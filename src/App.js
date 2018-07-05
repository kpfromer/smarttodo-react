import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Header from "./components/Header/Header";
import TodoList from "./containers/TodoList/TodoList";
import NotFound from "./components/NotFound/NotFound";
import Login from "./components/Login/Login";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import Logout from "./components/Logout/Logout";

import styles from './App.module.css'


class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className={styles.container}>
          <Header/>
          <Switch>
            <PrivateRoute path="/todo" component={TodoList}/>
            <Route exact path="/login" component={Login}/>
            <Route exact path="/logout" component={Logout}/>
            <Route component={NotFound}/>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
