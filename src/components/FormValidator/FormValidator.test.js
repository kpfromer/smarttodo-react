import React, { Component } from "react";
import { mount } from 'enzyme';
import FormValidator from "./FormValidator";
import { ValidatorContext } from './ValidatorContext';

class MockValidateInput extends Component {
  render() {
    return <div />
  }
}

const MockValidatorContextConsumer = ({ name }) =>
  <ValidatorContext.Consumer>
    {
      ({ initializeInput, removeInput, updateFormInput }) =>
        <MockValidateInput
          name={name}
          initializeInput={initializeInput}
          removeInput={removeInput}
          updateFormInput={updateFormInput}
        />
    }
  </ValidatorContext.Consumer>;

describe('FormValidator', () => {
  let wrapper, mockHandleSubmit, mockHandleError;

  beforeEach(() => {
    mockHandleSubmit = jest.fn();
    mockHandleError = jest.fn();

    wrapper = mount(
      <FormValidator onSubmit={mockHandleSubmit} onError={mockHandleError}>
        <div>
          <div>
            <MockValidatorContextConsumer name="input1" />
          </div>
          <div>
            <MockValidatorContextConsumer name="input2" />
          </div>
        </div>
      </FormValidator>
    );

    wrapper.find(MockValidateInput).forEach(component => {
      const { name, initializeInput } = component.props();
      initializeInput(name);
    });
  });

  it('calls onSubmit if all input values are not errored', () => {
    wrapper.find(MockValidateInput).forEach(component => {
      const { name, updateFormInput } = component.props();
      updateFormInput({
        name,
        error: false
      });
    });
    const mockPreventDefault = jest.fn();

    wrapper.find('form').simulate('submit', { preventDefault: mockPreventDefault });

    expect(mockPreventDefault).toHaveBeenCalled();
    expect(mockHandleSubmit).toHaveBeenCalled();
  });
  it('calls onError if some input values are invalid', () => {
    wrapper.find(MockValidateInput).forEach((component, index) => {
      const { name, updateFormInput } = component.props();

      let error;

      if (index === 0) {
        error = true;
      } else if (index === 1) {
        error = false;
      } else {
        throw new Error('TEST ERROR: Invalid amount of MockValidators!');
      }

      updateFormInput({
        name,
        error
      });
    });

    wrapper.find('form').simulate('submit', { preventDefault: () => {} });

    expect(mockHandleError).toHaveBeenCalled();
  });
  it('calls onError if some inputs are not edited', () => {
    const firstInput = wrapper.find(MockValidateInput).first();
    firstInput.props().updateFormInput({
      name: firstInput.props().name,
      error: false
    });

    wrapper.find('form').simulate('submit', { preventDefault: () => {} });

    expect(mockHandleError).toHaveBeenCalled();
  });
  // TODO: test for removeInput
});