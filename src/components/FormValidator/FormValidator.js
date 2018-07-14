import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ValidatorContext } from './ValidatorContext';

// TODO: refactor
// TODO: error on touch (when user enters then immediately leaves)
// TODO: validate all elements on submit, for example required empty inputs would become red
export default class FormValidator extends Component {

  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    validateOnSubmit: PropTypes.bool,
    onError: PropTypes.func
  };

  static defaultProps = {
    validateOnSubmit: false,
    onError: () => {
    }
  };

  updateFormInput = ({ name, value, error }) => {
    this.setState(prevState => ( {
      initializedInputs: prevState.initializedInputs.map(input => {
        if (input.name === name) {
          return {
            ...input,
            value,
            edited: true
          };
        }
        return input;
      })
    } ));

    if (error) {
      this.setState(prevState => ( {
        errors: [
          ...prevState.errors,
          name
        ]
      } ));
    } else {
      this.setState(prevState => ( {
        errors: prevState.errors.filter(erroredInputName => erroredInputName !== name)
      } ));
    }
  };

  initializeInput = (name, value, triggerValidation) =>
    this.setState(prevState => ( {
      initializedInputs: [...prevState.initializedInputs, { name, value, triggerValidation, edited: false }]
    } ));

  removeInput = name =>
    this.setState(prevState => ( {
      errors: prevState.errors.filter(errorName => errorName !== name),
      initializedInputs: prevState.initializedInputs.filter(input => input.name !== name)
    } ));

  state = {
    context: {
      initializeInput: this.initializeInput,
      removeInput: this.removeInput,
      updateFormInput: this.updateFormInput,
    },
    initializedInputs: [],
    errors: []
  };

  handleSubmit = event => {
    event.preventDefault();

    const { errors, initializedInputs } = this.state;

    if (this.props.validateOnSubmit) {
      initializedInputs.forEach(input => input.triggerValidation(input.value));
    }

    if (errors.length === 0 && initializedInputs.every(input => input.edited)) {
      this.props.onSubmit();
    } else {
      this.props.onError();
    }
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <ValidatorContext.Provider value={this.state.context}>
          {this.props.children}
        </ValidatorContext.Provider>
      </form>
    );
  }
}
