import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { email, maxLength, minLength, required } from './TextValidatedMethods';
import TextValidator from "./TextValidator";

export default class TextValidated extends Component {

  static propTypes = {
    hintName: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string,
    textValidatorProps: PropTypes.object,
    required: PropTypes.bool,
    minLength: PropTypes.number,
    maxLength: PropTypes.number,
    email: PropTypes.bool
  };

  static defaultProps = {
    required: null,
    minLength: null,
    maxLength: null,
    email: null
  };

  validatedMethods = {
    required,
    minLength,
    maxLength,
    email
  };

  render() {
    const { name, value, onChange, hintName, textValidatorProps, ...validationTypes } = this.props;
    const validate = Object.keys(validationTypes)
      .filter(validationName => this.props[validationName] !== null)
      .map(validationName => {
        if (!Object.keys(this.validatedMethods).includes(validationName)) {
          throw new Error(`Invalid property of TextValidated: ${validationName}`);
        }

        const validateValue = this.props[validationName];

        if (!validateValue) {
          throw new Error(`Invalid property of TextValidated: ${validationName}`);
        }

        const { hint, validate } = this.validatedMethods[validationName](validateValue);
        return {
          text: hint(hintName),
          validate
      }
    });

    return (
      <TextValidator
        {...textValidatorProps}
        name={name}
        value={value}
        onChange={onChange}
        validate={validate}
      />
    );
  }
}
