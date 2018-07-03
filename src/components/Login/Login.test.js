import { Login } from "./Login";
import { SetupComponent } from "react-component-setup";
import TextValidator from "../FormValidator/TextValidator";
import FormValidator from "../FormValidator/FormValidator";
import Snackbar from "@material-ui/core/Snackbar";

const { shallow: setup } = SetupComponent({
  component: Login
});

describe('Login', () => {
  let wrapper, mockLogin;

  beforeEach(() => {
    mockLogin = jest.fn();
    ({ wrapper } = setup({
      login: mockLogin
    }));
  });

  // TODO: dry!
  describe('user enters username', () => {
    let username, refresh, newValue;

    beforeEach(() => {
      refresh = () => wrapper.find(TextValidator).findWhere(node => node.prop('name') === 'username');
      username = refresh();

      newValue = 'example username';

      username.props().onChange({ value: newValue });
      wrapper.update();
      username = refresh();
    });

    it('username input value changes', () => {
      expect(username).toHaveProp('value', newValue);
    });
    it('validates input', () => {
      expect(username.props().validate('notempty')).toBe(true);
      expect(username.props().validate('')).toBe(false);
    });
  });
  
  describe('user enters password', () => {
    let password, refresh, newValue;

    beforeEach(() => {
      refresh = () => wrapper.find(TextValidator).findWhere(node => node.prop('name') === 'password');
      password = refresh();

      newValue = 'example password';

      password.props().onChange({ value: newValue });
      wrapper.update();
      password = refresh();
    });

    it('password input value changes', () => {
      expect(password).toHaveProp('value', newValue);
    });
    it('validates input', () => {
      expect(password.props().validate('notempty')).toBe(true);
      expect(password.props().validate('')).toBe(false);
    });
  });

  describe('user submits login form with username and password filled', () => {
    let username, password, findTextValidatorByName;

    beforeEach(() => {
      findTextValidatorByName = name => wrapper.find(TextValidator).findWhere(node => node.prop('name') === name);

      username = 'exampleUsername';
      password = 'examplePassword';

      findTextValidatorByName('username').props().onChange({ value: username });
      findTextValidatorByName('password').props().onChange({ value: password });
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
        expect(findTextValidatorByName('password')).toHaveProp('value', '');
      });
      it('displays a snackbar message with the api error', () => {
        expect(wrapper.find(Snackbar)).toMatchSnapshot();
      });
      describe('error snackbar', () => {
        it('closes when the X icon is clicked', () => {
          wrapper.find(Snackbar).props().onClose();
          wrapper.update();
          expect(wrapper.find(Snackbar)).toHaveProp('open', false);
        });
      });
    });
  });
});