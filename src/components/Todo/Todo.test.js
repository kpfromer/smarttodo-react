import { SetupComponent } from "react-component-setup";
import Todo from "./Todo";
import DescriptionForm from "./DescriptionForm";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';

const { shallow: setup } = SetupComponent({
  component: Todo,
  defaultProps: {
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
    expect(wrapper.find(ListItem)).toMatchSnapshot();
  });

  describe('on checkbox click', () => {
    let wrapper, mockCheck;

    beforeEach(() => {
      mockCheck = jest.fn();

      ({ wrapper } = setup({ onCheck: mockCheck }));

      wrapper.find(Checkbox).props().onChange({ target: { checked: false } });
      wrapper.update();
    });

    it('runs `onCheck` with id and checked value', () => {
      expect(mockCheck).toHaveBeenCalledWith(false);
    });
  });

  describe('on ListItemText click', () => {
    let wrapper, mockUpdate;

    beforeEach(() => {
      mockUpdate = jest.fn();

      ({ wrapper } = setup({
        onUpdate: mockUpdate
      }));

      wrapper.find(ListItemText).simulate('click');
    });

    it('renders the DescriptionForm for editing', () => {
      expect(wrapper.find(DescriptionForm)).toMatchSnapshot();
    });

    describe('on DescriptionForm update', () => {
      beforeEach(() => {
        wrapper.find(DescriptionForm).props().onUpdate('new description');
        wrapper.update();
      });

      it('runs `onUpdate` with id and updated description', () => {
        expect(mockUpdate).toHaveBeenCalledWith('new description');
      });
    });
  });

  describe('on DeleteIcon click', () => {
    let wrapper, mockRemove;

    beforeEach(() => {

      mockRemove = jest.fn();

      ({ wrapper } = setup({
        onRemove: mockRemove
      }));

      wrapper.find(IconButton).simulate('click');
    });

    it('runs `onRemove` with id', () => {
      expect(mockRemove).toHaveBeenCalled();
    });
  });
});