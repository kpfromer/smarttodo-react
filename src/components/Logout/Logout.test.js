import { SetupComponent } from "react-component-setup";
import { Logout } from "./Logout";

const { shallow: setup } = SetupComponent({
  Component: Logout
});

describe('Logout', () => {
  let wrapper, mockLogout;

  beforeEach(() => {
    mockLogout = jest.fn();
    ({ wrapper } = setup({
      logout: mockLogout
    }))
  });

  it('logouts user', () => {
    expect(mockLogout).toHaveBeenCalled();
  });
  it('redirects to /', () => {
    expect(wrapper).toMatchSnapshot();
  });
});