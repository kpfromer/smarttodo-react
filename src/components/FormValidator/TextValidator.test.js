import React from "react";
import { TextValidator } from "./TextValidator";
import { mount, shallow } from 'enzyme';
import { SetupComponent } from "react-component-setup";
import TextField from '@material-ui/core/TextField';

const getComponentWithContext = context => {
  // mock out the context you're using in the component
  jest.doMock('./ValidatorContext', () => {
    return {
      ValidatorContext: {
        Consumer: (props) => props.children(context)
      }
    }
  });

  // you need to re-require after calling jest.doMock.
  // return the updated Component module that now includes the mocked context
  return require('./TextValidator').default;
};

describe('TextValidator', () => {
  let wrapper, mockHandleChange, mockValidate;

  beforeEach(() => {
    jest.resetModules();
    mockHandleChange = jest.fn();
    mockValidate = jest.fn();
  });

  describe('without context', () => {
    beforeEach(() => {
      const { shallow: setup } = SetupComponent({
        component: TextValidator,
        defaultProps: {
          value: 'initial',
          onChange: mockHandleChange,
          validate: mockValidate,
          textFieldProps: {
            miscOptionsToBeAddedToTextField: 'hello world'
          }
        }
      });

      ( { wrapper } = setup() );
    });

    it('renders a TextField with value and other properties', () => {
      expect(wrapper).toMatchSnapshot();
    });

    describe('given `validateOnBlur`', () => {
      let blurValue;

      beforeEach(() => {
        blurValue = 'blur value';
        wrapper = shallow(
          <TextValidator validateOnBlur value={blurValue} onChange={() => {}} validate={mockValidate}/>
        )
      });

      it('validates TextValid value when user clicks away', () => {
        mockValidate.mockReturnValue(false);
        wrapper.find(TextField).simulate('focus');
        wrapper.find(TextField).simulate('blur', { target: { value: blurValue } });
        expect(mockValidate).toHaveBeenCalledWith(blurValue);
      });
    });

    describe('user enters text', () => {
      let newValue, valid, simulateChange, errorText;

      beforeEach(() => {
        newValue = 'new value';
        valid = false;

        simulateChange = () => {
          wrapper.find(TextField).props().onChange({ target: { value: newValue } });
          wrapper.update();
        };
      });
      // TODO: extract into library? pull request into jest-each?
      // simple version of a parameterized test, see jest-each
      // TODO: refactor even further, common setup - simulateChange, switch case based on type
      [
        {
          type: 'function',
          setup: () => {
            mockValidate.mockReturnValue(valid);
          }
        },
        {
          type: 'object',
          setup: () => {
            errorText = 'A ERROR! AHHHHHHHH!';
            wrapper.setProps({
              validate: {
                text: errorText,
                validate: mockValidate
              }
            });
          }
        },
        {
          type: 'array',
          setup: () => {
            errorText = 'SECOND ERROR!';
            wrapper.setProps({
              validate: [
                {
                  text: 'FIRST',
                  validate: () => true
                },
                {
                  text: errorText,
                  validate: mockValidate
                }
              ]
            });
          }
        }
      ].forEach(valueType => {
        const { type, setup } = valueType;
        describe(`when \`validate\` is a ${type}`, () => {
          beforeEach(() => {
            setup();
            simulateChange();
          });

          it('validates value', () => {
            expect(mockValidate).toHaveBeenCalledWith(newValue);
          });

          it('passes change and validity up to parent component', () => {
            expect(mockHandleChange).toHaveBeenCalledWith({
              error: !valid,
              value: newValue
            });
          });

          it('renders TextField with error if invalid', () => {
            expect(wrapper.find(TextField)).toHaveProp('error', true);
          });

          switch (type) {
            case 'object':
            case 'array':
              it('renders error helperText', () => {
                expect(wrapper.find(TextField)).toHaveProp('helperText', errorText);
              });
          }
        });
      });
    });
  });

  describe('with context', () => {
    let name, value, Component, mockUpdateFormInput, mockInitializeInput, mockRemoveInput, mockValidate;
    beforeEach(() => {
      name = 'usernameInput';
      value = 'initial';

      mockUpdateFormInput = jest.fn();
      mockInitializeInput = jest.fn();
      mockRemoveInput = jest.fn();
      mockValidate = jest.fn();

      Component = getComponentWithContext({
        updateFormInput: mockUpdateFormInput,
        initializeInput: mockInitializeInput,
        removeInput: mockRemoveInput
      });

      wrapper = mount(
        <Component
          name={name}
          value={value}
          onChange={() => {
          }}
          validate={mockValidate}
        />
      );
    });
    // TODO: rename properties
    it('initializes input on creation', () => {
      expect(mockInitializeInput.mock.calls[0].slice(0, 2)).toEqual([name, value]);
      expect(mockInitializeInput.mock.calls[0][2]).toBe(wrapper.find('TextValidator').instance().validateValue);
    });
    it('deinitializes and reinitializes if name changes', () => {
      const differentName = 'adifferentname';
      wrapper.setProps({
        name: differentName
      });
      expect(mockRemoveInput).toHaveBeenCalledWith(name);
      // expect(mockInitializeInput.mock.calls[0].slice(0, 2)).toHaveBeenCalledWith([differentName, value]);
      // expect(mockInitializeInput.mock.calls[0][2]).toBe(wrapper.find('TextValidator').instance().validateValue)
    });
    it('updates form input error and value on TextField value change', () => {
      const invalid = true;
      const value = 'new invalid value';

      mockValidate.mockReturnValue(!invalid);
      wrapper.find('TextField').props().onChange({ target: { value } });
      wrapper.update();

      expect(mockUpdateFormInput).toHaveBeenCalledWith({
        name,
        value,
        error: invalid
      })
    });
    it('deinitializes input on unmount', () => {
      wrapper.unmount();
      expect(mockRemoveInput).toHaveBeenCalledWith(name);
    });
  });
});