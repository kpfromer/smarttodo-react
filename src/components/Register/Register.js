import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { tryRegister } from "../../actions/register";
import { connect } from 'react-redux';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import FormValidator from "../FormValidator/FormValidator";
import { Redirect } from "react-router-dom";
import TextValidated from "../FormValidator/TextValidated";
import { closeSnackbar } from "../../actions/snackbar";

export class Register extends Component {

  static propTypes = {
    register: PropTypes.func.isRequired
  };

  state = {
    redirect: false,
    username: '',
    password: '',
    email: '',
    firstName: '',
    lastName: ''
  };

  updateValue = valueName => event => {
    const { value } = event;
    this.setState({
      [valueName]: value
    })
  };

  handleSubmit = () => {
    const { username, password, email, firstName, lastName } = this.state;
    this.props.register(username, password, email, firstName, lastName)
      .then(() => {
        this.props.closeSnackbar({
          message: 'Redirecting to login',
          variant: 'success'
        });
        this.setState({ redirect: true })
      })
      .catch(response => {
        this.props.closeSnackbar({
          message: response.error,
          variant: 'error'
        });
        this.setState({ password: '' });
      });
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to="/login"/>
    }

    return (
      <div>
        <Card>
          <FormValidator onSubmit={this.handleSubmit}>
            <CardContent>
              <Typography variant="title">
                Register
              </Typography>
              <TextValidated
                name="username"
                hintName="Username"
                required
                value={this.state.username}
                onChange={this.updateValue('username')}
                textFieldProps={{
                  autoFocus: true,
                  margin: 'dense',
                  label: 'Username',
                  type: 'text',
                  fullWidth: true
                }}
              />
              <TextValidated
                name="password"
                hintName="Password"
                required
                value={this.state.password}
                onChange={this.updateValue('password')}
                textFieldProps={{
                  margin: 'dense',
                  label: 'Password',
                  type: 'password',
                  fullWidth: true
                }}
              />
              <TextValidated
                name="email"
                hintName="Email"
                email
                value={this.state.email}
                onChange={this.updateValue('email')}
                textFieldProps={{
                  margin: 'dense',
                  label: 'Email',
                  type: 'email',
                  fullWidth: true
                }}
              />
              <TextValidated
                name="firstName"
                hintName="First Name"
                required
                value={this.state.firstName}
                onChange={this.updateValue('firstName')}
                textFieldProps={{
                  margin: 'dense',
                  label: 'First Name',
                  type: 'text',
                  fullWidth: true
                }}
              />
              <TextValidated
                name="lastName"
                hintName="Last Name"
                required
                value={this.state.lastName}
                onChange={this.updateValue('lastName')}
                textFieldProps={{
                  margin: 'dense',
                  label: 'Last Name',
                  type: 'text',
                  fullWidth: true
                }}
              />
            </CardContent>
            <CardActions>
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

export default connect(null, { register: tryRegister, closeSnackbar })(Register);