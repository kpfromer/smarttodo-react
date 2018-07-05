import { SetupComponent } from "react-component-setup";
import NewTodo from "./NewTodo";
import DescriptionForm from "./DescriptionForm";

const { shallow: setup } = SetupComponent({
  component: NewTodo,
  defaultProps: {
    onCreate: () => {}
  }
});

describe('NewTodo', () => {
  it('renders without crashing', () => {
    setup();
  });

  it('renders a DescriptionForm that clears on update', () => {
    expect(setup().wrapper).toMatchSnapshot();
  });

  it('it triggers onCreate when DescriptionForm updates', () => {
    const value = 'new value';
    const mockHandleCreate = jest.fn();

    const { wrapper } = setup({
      onCreate: mockHandleCreate
    });
    wrapper.find(DescriptionForm).props().onUpdate(value);
    wrapper.update();

    expect(mockHandleCreate).toHaveBeenCalledWith(value);
  });
});