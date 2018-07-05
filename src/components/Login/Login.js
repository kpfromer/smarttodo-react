import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Card from '@material-ui/core/Card';
import { tryLogin } from "../../actions/login";
import { Redirect, withRouter } from "react-router-dom";
import Snackbar from "@material-ui/core/Snackbar";
import SpecialSnackbar from "../SpecialSnackbar/SpecialSnackbar";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import FormValidator from "../FormValidator/FormValidator";
import TextValidator from "../FormValidator/TextValidator";

import styles from './Login.module.css';

export class Login extends PureComponent {

  static propTypes = {
    login: PropTypes.func.isRequired
  };

  state = {
    username: '',
    password: '',
    loginError: false,
    errorMessage: 'Failed to login',
    redirectToReferrer: false
  };

  loginUser = (username, password) =>
    this.props.login(username, password)
      .then(
        () => this.setState({ redirectToReferrer: true })
      )
      .catch(repsonse =>
        this.setState({
          loginError: true,
          errorMessage: repsonse.error,
          password: ''
        })
      );

  handleClose = () => this.setState({ loginError: false });

  handleSubmit = () => {
    const { username, password } = this.state;
    this.loginUser(username, password);
  };

  updateValue = valueName => event => {
    const { value } = event;
    this.setState({
      [valueName]: value
    })
  };

  validate = name => ([
    {
      validate: value => !!value,
      text: `${name} is required`
    },
    {
      validate: value => value.length > 3,
      text: `${name} must be more than 3 characters`
    }
  ]);

  render() {
    if (this.state.redirectToReferrer) {
      // TODO: add flash message to and from
      // https://github.com/mjrussell/redux-auth-wrapper/issues/64
      return <Redirect to="/todo"/>;
    }

    return (
      <Fragment>
        <div className={styles.container}>
          <Card className={styles.card}>
            <FormValidator onSubmit={this.handleSubmit}>
              <CardContent>
                <Typography variant="title">
                  Login
                </Typography>
                <TextValidator
                  name="username"
                  value={this.state.username}
                  onChange={this.updateValue('username')}
                  validate={this.validate('Username')}
                  textFieldProps={{
                    autoFocus: true,
                    margin: 'dense',
                    label: 'Username',
                    type: 'text',
                    // autoComplete: 'username',
                    fullWidth: true
                  }}
                />
                <TextValidator
                  name="password"
                  value={this.state.password}
                  onChange={this.updateValue('password')}
                  validate={this.validate('Password')}
                  textFieldProps={{
                    autoFocus: true,
                    margin: 'dense',
                    label: 'Password',
                    type: 'password',
                    // autoComplete: 'current-password',
                    fullWidth: true
                  }}
                />
              </CardContent>
              <CardActions className={styles.cardActions}>
                <Button type="submit" size="medium" color="primary">
                  Submit
                </Button>
              </CardActions>
            </FormValidator>
          </Card>
        </div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={this.state.loginError}
          autoHideDuration={3000}
          onClose={this.handleClose}
        >
          <SpecialSnackbar
            onClose={this.handleClose}
            variant="error"
            message={this.state.errorMessage}
          />
        </Snackbar>
      </Fragment>
    );
  }
}

export default connect(null, {
  login: tryLogin
})(withRouter(Login));