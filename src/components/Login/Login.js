import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Card from '@material-ui/core/Card';
import { tryLogin } from "../../actions/login";
import { Redirect, withRouter } from "react-router-dom";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import FormValidator from "../FormValidator/FormValidator";

import styles from './Login.module.css';
import TextValidated from "../FormValidator/TextValidated";
import { changeSnackbar } from "../../actions/snackbar";

export class Login extends PureComponent {

  static propTypes = {
    login: PropTypes.func.isRequired,
    changeSnackbar: PropTypes.func.isRequired
  };

  state = {
    username: '',
    password: '',
    redirectToReferrer: false
  };

  loginUser = (username, password) =>
    this.props.login(username, password)
      .then(() => {
        this.props.changeSnackbar({
          message: 'Successfully logged in. Redirecting!',
          variant: 'success'
        });
        this.setState({ redirectToReferrer: true });
      })
      .catch(response => {
        this.props.changeSnackbar({
          message: response.error,
          variant: 'error'
        });
        this.setState({ password: '' })
      });

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
      <div className={styles.container}>
        <Card className={styles.card}>
          <FormValidator onSubmit={this.handleSubmit}>
            <CardContent>
              <Typography variant="title">
                Login
              </Typography>
              <TextValidated
                name="username"
                hintName="Username"
                required
                minLength={3}
                value={this.state.username}
                onChange={this.updateValue('username')}
                textFieldProps={{
                  autoFocus: true,
                  margin: 'dense',
                  label: 'Username',
                  type: 'text',
                  // autoComplete: 'username',
                  fullWidth: true
                }}
              />
              <TextValidated
                name="password"
                hintName="Password"
                required
                minLength={3}
                value={this.state.password}
                onChange={this.updateValue('password')}
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
    );
  }
}

export default connect(null, {
  login: tryLogin,
  changeSnackbar
})(withRouter(Login));