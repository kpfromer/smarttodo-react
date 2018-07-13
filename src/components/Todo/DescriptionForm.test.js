import DescriptionForm from "./DescriptionForm";
import { SetupComponent } from "react-component-setup";
import TextField from '@material-ui/core/TextField';

const { shallow: setup } = SetupComponent({
  component: DescriptionForm,
  defaultProps: {
    onUpdate: newDescription => {}
  },
  elementsToFind: [
    {
      name: 'input',
      query: TextField
    }
  ]
});

describe('DescriptionForm', () => {
  it('renders input with provided `description`', () => {
    const { input } = setup({
      description: 'default description'
    });

    expect(input).toHaveProp('value', 'default description')
  });

  it('renders Textfield with `textFieldProps`', () => {
    const { input } = setup({
      textFieldProps: {
        autoFocus: true,
        otherValue: 'different'
      }
    });

    expect(input).toHaveProp('autoFocus', true);
    expect(input).toHaveProp('otherValue', 'different');
  });

  it('display valid input', () => {
    const { input } = setup();

    expect(input).toHaveProp('error', false);
  });

  describe('user inputs text', () => {
    let wrapper, description;

    beforeEach(() => {
      ({ wrapper } = setup());

      description = 'New Description';

      wrapper.find(TextField).simulate('change', { target: { value: description } });
    });

    it('updates input value', () => {
      expect(wrapper.find(TextField)).toHaveProp('value', (description));
    });

    it('should be a valid input', () => {
      expect(wrapper.find(TextField)).toHaveProp('error', false);
    });

    describe('user removes all text', () => {
      it('renders an errored input', () => {
        wrapper.find(TextField).simulate('change', { target: { value: '' } });

        expect(wrapper.find(TextField)).toHaveProp('error', true);
      });
    });
  });

  describe('on submit', () => {
    let wrapper, mockOnUpdate, mockPreventDefault, newDescription;

    beforeEach(() => {
      mockPreventDefault = jest.fn();
      mockOnUpdate = jest.fn();
      ({ wrapper } = setup({
        onUpdate: mockOnUpdate
      }));

      newDescription = 'hello world!';

      wrapper.find(TextField).simulate('change', { target: { value: newDescription } });
      wrapper.find('form').simulate('submit', { preventDefault: mockPreventDefault });
    });

    it('triggers `onUpdate` with description value', () => {
      expect(mockOnUpdate).toHaveBeenCalledWith(newDescription);
    });

    it('prevents page refresh', () => {
      expect(mockPreventDefault).toHaveBeenCalled();
    });

    it('maintains input value', () => {
      expect(wrapper.find(TextField)).toHaveProp('value', newDescription);
    });
  });

  describe('given `clearOnUpdate`', () => {
    let wrapper, newDescription;

    beforeEach(() => {
      ({ wrapper } = setup({
        clearOnUpdate: true
      }));

      newDescription = 'it\'s wednesday my dudes';

      wrapper.find(TextField).simulate('change', { target: { value: newDescription } });
      wrapper.find('form').simulate('submit', { preventDefault: () => {} });
    });

    it('clears value of input when submitted', () => {
      expect(wrapper.find(TextField)).toHaveProp('value', '');
    });
  });
});