import * as validatedMethods from './TextValidatedMethods';
import TextValidated from "./TextValidated";
import { SetupComponent } from "react-component-setup";
import TextValidator from "./TextValidator";

jest.mock('./TextValidatedMethods');

const { shallow: setup } = SetupComponent({
  component: TextValidated,
  defaultProps: {
    hintName: 'exHintName',
    value: 'exValue',
    onChange: () => {}
  }
});

describe('TextValidated', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    setup();
  });
  it('renders a TextValidator', () => {
    const mockHandleChange = jest.fn();
    const { wrapper } = setup({
      name: 'exName',
      onChange: mockHandleChange
    });

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.props().onChange).toBe(mockHandleChange);
  }); // TODO: test that onChange func toBe (NOT TO EQUAL) provided func

  describe('validation', () => {
    it('provides TextValidated with validation based on validatedMethods', () => {
      const mockHint = jest.fn().mockReturnValue('length less than five!');
      const mockValidate = jest.fn();
      validatedMethods.maxLength.mockReturnValue({
        hint: mockHint,
        validate: mockValidate
      });

      const { wrapper } = setup({
        maxLength: 5
      });

      expect(wrapper.find(TextValidator).props().validate).toMatchSnapshot();
      expect(wrapper.find(TextValidator).props().validate[0].validate).toBe(mockValidate);

      expect(validatedMethods.maxLength).toHaveBeenCalledWith(5);
      expect(mockHint).toHaveBeenCalledWith('exHintName');
    });
  });

  describe('given `textValidatorProps`', () => {
    it('passes the values to the TextValidator', () => {
      const values = {
        margin: 'different',
        textFieldProps: {
          width: 'a value'
        }
      };
      const { wrapper } = setup({
        textValidatorProps: values
      });

      expect(wrapper.find(TextValidator).props()).toMatchObject(values);
    });
  });
});