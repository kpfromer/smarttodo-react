import { Login } from "./Login";
import { SetupComponent } from "react-component-setup";
import TextValidator from "../FormValidator/TextValidator";
import FormValidator from "../FormValidator/FormValidator";
import Snackbar from "@material-ui/core/Snackbar";

const { shallow: setup } = SetupComponent({
  component: Login
});

describe('Login', () => {
  let wrapper, mockLogin, get;

  beforeEach(() => {
    get = name => wrapper.find(TextValidator).findWhere(node => node.prop('name') === name);

    mockLogin = jest.fn();
    ({ wrapper } = setup({
      login: mockLogin
    }));
  });

  [
    {
      type: 'username',
      setup: () => 'example username'
    },
    {
      type: 'password',
      setup: () => 'example password'
    }
  ].forEach(value => {
    const { type, setup } = value;

    describe(`user enters ${type}`, () => {
      let input, newValue;

      beforeEach(() => {
        input = get(type);

        newValue = setup();

        input.props().onChange({ value: newValue });
        wrapper.update();
        input = get(type);
      });

      it(`${type} input value changes`, () => {
        expect(input).toHaveProp('value', newValue);
      });
      it('validates input', () => {
        expect(input.props().validate).toMatchSnapshot();

        const isRequired = input.props().validate.find(value => value.text.includes('is required')).validate;
        const moreThanThree = input.props().validate.find(value => value.text.includes('must be more than 3 characters')).validate;

        expect(isRequired('hello')).toBe(true);
        expect(isRequired('')).toBe(false);
        expect(moreThanThree('3333')).toBe(true);
        expect(moreThanThree('fff')).toBe(false);
      });
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