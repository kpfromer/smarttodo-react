import DescriptionForm from "./DescriptionForm";
import { SetupComponent } from "react-component-setup";

const { shallow: setup } = SetupComponent({
  Component: DescriptionForm,
  defaultProps: {
    onUpdate: newDescription => {}
  },
  elementsToFind: [
    {
      name: 'input',
      query: 'input'
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

  it('renders input with `className`', () => {
    const { input } = setup({
      className: 'NEW-CLASS'
    });

    expect(input).toHaveClassName('NEW-CLASS');
  });

  it('display valid input', () => {
    const { input } = setup({ invalidClassName: 'INVALID' });

    expect(input).not.toHaveClassName('INVALID');
  });

  describe('user inputs text', () => {
    let wrapper, description, invalidClassName;

    beforeEach(() => {
      invalidClassName = 'INVALID_INPUT';

      ({ wrapper } = setup({
        invalidClassName
      }));

      description = 'New Description';

      wrapper.find('input').simulate('change', { target: { value: description } });
    });

    it('updates input value', () => {
      expect(wrapper.find('input')).toHaveProp('value', (description));
    });

    it('should be a valid input', () => {
      expect(wrapper.find('input')).not.toHaveClassName(invalidClassName)
    });

    describe('user removes all text', () => {
      it('renders input with `invalidClassName`', () => {
        wrapper.find('input').simulate('change', { target: { value: '' } });

        expect(wrapper.find('input')).toHaveClassName(invalidClassName);
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

      wrapper.find('input').simulate('change', { target: { value: newDescription } });
      wrapper.find('form').simulate('submit', { preventDefault: mockPreventDefault });
    });

    it('triggers `onUpdate` with description value', () => {
      expect(mockOnUpdate).toHaveBeenCalledWith(newDescription);
    });

    it('prevents page refresh', () => {
      expect(mockPreventDefault).toHaveBeenCalled();
    });

    it('maintains input value', () => {
      expect(wrapper.find('input')).toHaveProp('value', newDescription);
    });
  });

  describe('given `clearOnUpdate`', () => {
    let wrapper, newDescription;

    beforeEach(() => {
      ({ wrapper } = setup({
        clearOnUpdate: true
      }));

      newDescription = 'it\'s wednesday my dudes';

      wrapper.find('input').simulate('change', { target: { value: newDescription } });
      wrapper.find('form').simulate('submit', { preventDefault: () => {} });
    });

    it('clears value of input when submitted', () => {
      expect(wrapper.find('input')).toHaveProp('value', '');
    });
  });
});