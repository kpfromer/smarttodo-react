import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Header from "./components/Header/Header";
import TodoList from "./containers/TodoList/TodoList";
import NotFound from "./components/NotFound/NotFound";
import Login from "./components/Login/Login";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import GlobalSnackbar from "./containers/GlobalSnackbar/GlobalSnackbar";
import Logout from "./components/Logout/Logout";
import Register from "./components/Register/Register";

import styles from './App.module.css'
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";


class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <ErrorBoundary>
          <div className={styles.container}>
            <Header/>
            <Switch>
              <PrivateRoute path="/todo" component={TodoList}/>
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login}/>
              <Route exact path="/logout" component={Logout}/>
              <Route component={NotFound}/>
            </Switch>
          </div>
          <GlobalSnackbar />
        </ErrorBoundary>
      </BrowserRouter>
    );
  }
}

export default App;
