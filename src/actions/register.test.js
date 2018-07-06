import * as register from './register';
import { CALL_API } from "../middleware/api/api";

describe('register actions', () => {
  describe('tryRegister', () => {
    let username, password, email, firstName, lastName;

    beforeEach(() => {
      username = 'exampleUsername';
      password = 'examplePassword';
      email = 'exampleEmail@email.org';
      firstName = 'firstIsMyName';
      lastName = 'lastIsMyName';
    });

    it('creates an action to POST user details', () => {
      const action = register.tryRegister(username, password, email, firstName, lastName);
      expect(action[CALL_API]).toMatchSnapshot();
    });
  });
});