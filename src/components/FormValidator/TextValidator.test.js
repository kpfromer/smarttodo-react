import React from "react";
import { TextValidator } from "./TextValidator";
import { mount } from 'enzyme';
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


      // describe('when `validate` is a function', () => {
      //   beforeEach(() => {
      //     mockValidate.mockReturnValue(valid);
      //     simulateChange();
      //   });
      //
      //   it('validates value', () => {
      //     expect(mockValidate).toHaveBeenCalledWith(newValue);
      //   });
      //
      //   it('passes change and validity up to parent component', () => {
      //     expect(mockHandleChange).toHaveBeenCalledWith({
      //       error: !valid,
      //       value: newValue
      //     });
      //   });
      //
      //   it('renders TextField with error if invalid', () => {
      //     expect(wrapper.find(TextField)).toHaveProp('error', true);
      //   });
      // });
      //
      // describe('when `validate` is an object', () => {
      //   let errorText;
      //   beforeEach(() => {
      //     errorText = 'A ERROR! AHHHHHHHH!';
      //     wrapper.setProps({
      //       validate: {
      //         text: errorText,
      //         validate: mockValidate
      //       }
      //     });
      //     simulateChange();
      //   });
      //
      //   it('validates value', () => {
      //     expect(mockValidate).toHaveBeenCalledWith(newValue);
      //   });
      //
      //   it('passes change and validity up to parent component', () => {
      //     expect(mockHandleChange).toHaveBeenCalledWith({
      //       error: !valid,
      //       value: newValue
      //     });
      //   });
      //
      //   it('renders TextField with error if invalid', () => {
      //     expect(wrapper.find(TextField)).toHaveProp('error', true);
      //   });
      //
      //   it('renders error helperText', () => {
      //     expect(wrapper.find(TextField)).toHaveProp('helperText', errorText);
      //   });
      // });
      //
      // describe('when `validate` is an array', () => {
      //   let errorText;
      //   beforeEach(() => {
      //     errorText = 'SECOND ERROR!';
      //     wrapper.setProps({
      //       validate: [
      //         {
      //           text: 'FIRST',
      //           validate: () => true
      //         },
      //         {
      //           text: errorText,
      //           validate: mockValidate
      //         }
      //       ]
      //     });
      //     simulateChange();
      //   });
      //
      //   it('validates value', () => {
      //     expect(mockValidate).toHaveBeenCalledWith(newValue);
      //   });
      //
      //   it('passes change and validity up to parent component', () => {
      //     expect(mockHandleChange).toHaveBeenCalledWith({
      //       error: !valid,
      //       value: newValue
      //     });
      //   });
      //
      //   it('renders TextField with error if invalid', () => {
      //     expect(wrapper.find(TextField)).toHaveProp('error', true);
      //   });
      //
      //   it('renders error helperText', () => {
      //     expect(wrapper.find(TextField)).toHaveProp('helperText', errorText);
      //   });
      // });
    });
  });

  describe('with context', () => {
    let name, mockUpdateFormInput, mockInitializeInput, mockRemoveInput, mockValidate;
    beforeEach(() => {
      name = 'usernameInput';

      mockUpdateFormInput = jest.fn();
      mockInitializeInput = jest.fn();
      mockRemoveInput = jest.fn();
      mockValidate = jest.fn();

      const Component = getComponentWithContext({
        updateFormInput: mockUpdateFormInput,
        initializeInput: mockInitializeInput,
        removeInput: mockRemoveInput
      });

      wrapper = mount(
        <Component
          name={name}
          value="initial"
          onChange={() => {
          }}
          validate={mockValidate}
        />
      );
    });
    // TODO: rename properties
    it('initializes input on creation', () => {
      expect(mockInitializeInput).toHaveBeenCalledWith(name);
    });
    it('deinitializes and reinitializes if name changes', () => {
      const differentName = 'adifferentname';
      wrapper.setProps({
        name: differentName
      });
      expect(mockRemoveInput).toHaveBeenCalledWith(name);
      expect(mockInitializeInput).toHaveBeenCalledWith(differentName);
    });
    it('updates form input error on TextField value change', () => {
      const invalid = true;

      mockValidate.mockReturnValue(!invalid);
      wrapper.find('TextField').props().onChange({ target: { value: 'new invalid value' } });
      wrapper.update();

      expect(mockUpdateFormInput).toHaveBeenCalledWith({
        name,
        error: invalid
      })
    });
    it('deinitializes input on unmount', () => {
      wrapper.unmount();
      expect(mockRemoveInput).toHaveBeenCalledWith(name);
    });
  });
});