import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { isArray, isPlainObject } from 'lodash';

import { ValidatorContext } from './ValidatorContext';
import TextField from '@material-ui/core/TextField';

const validateShape = PropTypes.shape({
  text: PropTypes.string.isRequired,
  validate: PropTypes.func.isRequired
}).isRequired;

export class TextValidator extends Component {

  static propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    validate: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.arrayOf(validateShape),
      validateShape
    ]).isRequired,
    validateOnBlur: PropTypes.bool,
    textFieldProps: PropTypes.object,
    name: PropTypes.string,
    updateFormInput: PropTypes.func,
    initializeInput: PropTypes.func,
    removeInput: PropTypes.func,
  };

  static defaultProps = {
    validateOnBlur: false
  };

  state = {
    error: false,
    errorText: ''
  };

  validateValue = value => {
    const { updateFormInput, validate, name } = this.props;

    let error = false;
    let errorText = '';

    const validatationObject = validateObj => {
      const isError = !validateObj.validate(value);
      if (isError) {
        error = true;
        errorText = validateObj.text;
      }
    };

    if (isArray(validate)) {
      for (const validateObj of validate) {
        validatationObject(validateObj);
        if (error) {
          break;
        }
      }
    } else if (isPlainObject(validate)) {
      validatationObject(validate);
    } else {
      error = !validate(value);
    }

    if (updateFormInput) {
      updateFormInput({
        name,
        value,
        error
      });
    }
    this.setState({ error, errorText });

    return { error };
  };

  componentDidMount() {
    const { initializeInput, name, value } = this.props;
    if (initializeInput) {
      initializeInput(name, value, this.validateValue);
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

  handleBlur = event => {
    if (this.props.validateOnBlur) {
      this.validateValue(event.target.value);
    }
  };

  render() {
    const { value, textFieldProps } = this.props;
    const { error, errorText } = this.state;
    return (
      <TextField
        {...textFieldProps}
        onBlur={this.handleBlur}
        value={value}
        error={error}
        onChange={this.handleChange}
        helperText={errorText}
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
