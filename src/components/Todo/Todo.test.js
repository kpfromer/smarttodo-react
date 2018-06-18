import { SetupComponent } from "react-component-setup";
import Todo from "./Todo";
import DescriptionForm from "./DescriptionForm";

const { shallow: setup } = SetupComponent({
  Component: Todo,
  defaultProps: {
    id: '666',
    description: 'what todo?',
    completed: true,
    onCheck: () => {},
    onRemove: () => {},
    onUpdate: () => {}
  }
});

describe('Todo', () => {

  it('renders without crashing', () => {
    setup();
  });

  it('renders a checkbox and displays `description` label', () => {
    const { wrapper } = setup();
    expect(wrapper.find('.view')).toMatchSnapshot();
  });

  it('renders the DescriptionForm for editing', () => {
    const { wrapper } = setup();
    expect(wrapper.find(DescriptionForm)).toMatchSnapshot();
  });

  describe('on checkbox click', () => {
    let wrapper, mockCheck;

    beforeEach(() => {
      mockCheck = jest.fn();

      ({ wrapper } = setup({ onCheck: mockCheck }));

      wrapper.find('input').simulate('change', { target: { checked: false } });
    });

    it('runs `onCheck` with id and checked value', () => {
      expect(mockCheck).toHaveBeenCalledWith('666', false);
    });
  });

  describe('on label double click', () => {
    let wrapper, mockUpdate;

    beforeEach(() => {
      mockUpdate = jest.fn();

      ({ wrapper } = setup({
        onUpdate: mockUpdate
      }));

      wrapper.find('label').simulate('doubleClick');
    });

    it('renders Todo with editing `className`', () => {
      expect(wrapper).toHaveClassName('editing');
    });

    describe('on DescriptionForm update', () => {
      beforeEach(() => {
        wrapper.find(DescriptionForm).props().onUpdate('new description');
      });

      it('runs `onUpdate` with id and updated description', () => {
        expect(mockUpdate).toHaveBeenCalledWith('666', 'new description');
      });
    });
  });

  describe('on remove button click', () => {
    let wrapper, mockRemove;

    beforeEach(() => {

      mockRemove = jest.fn();

      ({ wrapper } = setup({
        onRemove: mockRemove
      }));

      wrapper.find('button').simulate('click');
    });

    it('runs `onRemove` with id', () => {
      expect(mockRemove).toHaveBeenCalledWith('666');
    });
  });
});