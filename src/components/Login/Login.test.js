import { Login } from "./Login";
import { SetupComponent } from "react-component-setup";
import TextValidated from "../FormValidator/TextValidated";
import FormValidator from "../FormValidator/FormValidator";
import Snackbar from "@material-ui/core/Snackbar";

const { shallow: setup } = SetupComponent({
  component: Login
});

describe('Login', () => {
  let wrapper, mockLogin, get;

  beforeEach(() => {
    get = name => wrapper.find(TextValidated).findWhere(node => node.prop('name') === name);

    mockLogin = jest.fn();
    ({ wrapper } = setup({
      login: mockLogin
    }));
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