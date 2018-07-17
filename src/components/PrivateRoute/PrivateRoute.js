import React, { PureComponent } from 'react';
import { Redirect, Route } from "react-router-dom";
import { connect } from "react-redux";

export class PrivateRoute extends PureComponent {

  render() {
    const { component: Component, isAuthenticated, ...rest } = this.props;
    return (
      <Route {...rest} render={(props) => (
        isAuthenticated
          ? <Component {...props} />
          : <Redirect to={{
            pathname: '/login',
            // state: { from: props.location }
          }} />
      )} />
    );
  }
}

export const mapStateToProps = state => ({
  isAuthenticated: !!state.login.token
});

export default connect(mapStateToProps)(PrivateRoute);