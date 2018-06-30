import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { logout } from "../../actions/login";
import { Redirect } from "react-router-dom";

export class Logout extends PureComponent {

  static propTypes = {
    logout: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.logout();
  }

  render() {
    return <Redirect push to="/" />;
  }
}

export default connect(null, { logout })(Logout);