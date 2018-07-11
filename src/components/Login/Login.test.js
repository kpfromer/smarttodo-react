import { Login } from "./Login";
import { SetupComponent } from "react-component-setup";
import CircularProgress from '@material-ui/core/CircularProgress';
import TextValidated from "../FormValidator/TextValidated";
import FormValidator from "../FormValidator/FormValidator";

const { shallow: setup } = SetupComponent({
  component: Login,
  defaultProps: {
    login: () => {},
    changeSnackbar: () => {},
    isLoading: false
  }
});

describe('Login', () => {
  let wrapper, mockLogin, mockChangeSnackbar, get;

  beforeEach(() => {
    get = name => wrapper.find(TextValidated).findWhere(node => node.prop('name') === name);

    mockLogin = jest.fn();
    mockChangeSnackbar = jest.fn();
    ({ wrapper } = setup({
      login: mockLogin,
      changeSnackbar: mockChangeSnackbar
    }));
  });

  describe('when `isLoading`', () => {
    beforeEach(() => {
      ({ wrapper } = setup({
        isLoading: true
      }))
    });

    it('renders a progress circle', () => {
      expect(wrapper.find(CircularProgress)).toExist();
    });
  });

  describe('user submits login form with username and password filled', () => {
    let username, password, findTextValidatedByName;

    beforeEach(() => {
      findTextValidatedByName = name => wrapper.find(TextValidated).findWhere(node => node.prop('name') === name);

      username = 'exampleUsername';
      password = 'examplePassword';

      findTextValidatedByName('username').props().onChange({ value: username });
      findTextValidatedByName('password').props().onChange({ value: password });
      wrapper.update();
    });

    describe('if credentials are valid', () => {
      beforeEach(async () => {
        const promise = Promise.resolve();
        mockLogin.mockReturnValue(promise);
        wrapper.find(FormValidator).props().onSubmit();
        await promise;
        wrapper.update();
      });

      it('logins in user', () => {
        expect(mockLogin).toHaveBeenCalledWith(username, password);
      });
      it('redirects user to /todo', () => {
        expect(wrapper).toMatchSnapshot();
      });
      it('changes snackbar message to success', () => {
        expect(mockChangeSnackbar.mock.calls[0][0]).toMatchSnapshot();
      });
    });

    describe('if credentials are invalid', () => {
      let error;

      beforeEach(() => {
        error = 'Username/password were not found!';
        const promise = Promise.reject({
          error
        });
        mockLogin.mockReturnValue(promise);
        wrapper.find(FormValidator).props().onSubmit();
        return promise
          .then(() => {}) // See https://github.com/airbnb/enzyme/issues/450#issuecomment-341244926
          .catch(() => wrapper.update());
      });

      it('removes password', () => {
        expect(findTextValidatedByName('password')).toHaveProp('value', '');
      });
      it('changes snackbar message to error', () => {
        expect(mockChangeSnackbar.mock.calls[0][0]).toMatchSnapshot();
      });
    });
  });
});