import * as loginActions from './login';
import * as snackbar from "./snackbar";
import { serverLogout } from "./server-logout";

jest.mock('./snackbar', () => ({
  changeSnackbar: jest.fn()
}));

jest.mock('./login', () => ({
  logout: jest.fn()
}));

describe('serverLogout', () => {
  let action, mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.fn();
    snackbar.changeSnackbar.mockReturnValue('changeSnackbarAction');
    loginActions.logout.mockReturnValue('logoutAction');
    action = serverLogout(mockDispatch);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  it('changes snackbar message', () => {
    expect(snackbar.changeSnackbar.mock.calls[0][0]).toMatchSnapshot();
    expect(mockDispatch.mock.calls[0][0]).toBe('changeSnackbarAction');
  });
  it('then logouts user', () => {
    expect(mockDispatch.mock.calls[1][0]).toBe('logoutAction');
  });
});