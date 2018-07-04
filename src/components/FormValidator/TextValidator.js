import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ValidatorContext } from './ValidatorContext';
import TextField from '@material-ui/core/TextField';

export class TextValidator extends Component {

  static propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    validate: PropTypes.func.isRequired,
    name: PropTypes.string,
    updateFormInput: PropTypes.func,
    initializeInput: PropTypes.func,
    removeInput: PropTypes.func,
  };

  state = {
    error: false
  };

  validateValue = value => {
    const { updateFormInput, validate, name } = this.props;
    const error = !validate(value);
    if (updateFormInput) {
      updateFormInput({
        name,
        error
      });
    }
    this.setState({ error });

    return { error };
  };

  componentDidMount() {
    const { initializeInput, name } = this.props;
    if (initializeInput) {
      initializeInput(name);
    }
  }

  componentWillUnmount() {
    const { removeInput, name } = this.props;
    if (removeInput) {
      removeInput(name);
    }
  }

  componentDidUpdate(prevProps) {
    const { value: oldValue, name: oldName } = prevProps;
    const { value: newValue, name: newName, removeInput, initializeInput } = this.props;

    if (oldValue !== newValue) {
      this.validateValue(newValue);
    }

    if (oldName !== newName) {
      removeInput(oldName);
      initializeInput(newName);
    }
  }

  handleChange = event => {
    const { value } = event.target;
    const { error } = this.validateValue(value);
    this.props.onChange({ value, error });
  };

  render() {
    const { onChange, validate, name, updateFormInput, ...textFieldProps } = this.props;
    return (
      <TextField
        {...textFieldProps}
        error={this.state.error}
        onChange={this.handleChange}
      />
    );
  }
}

export default props =>
  <ValidatorContext.Consumer>
    {
      ({ updateFormInput, initializeInput, removeInput }) =>
        <TextValidator
          {...props}
          updateFormInput={updateFormInput}
          initializeInput={initializeInput}
          removeInput={removeInput}
        />
    }
  </ValidatorContext.Consumer>
