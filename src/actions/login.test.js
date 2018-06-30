import { logout, tryLogin } from "./login";
import { CALL_API } from "../middleware/api/api";

describe('login actions', () => {
  describe('tryLogin', () => {
    let username, password, action;

    beforeEach(() => {
      username = 'iAmARadUsername';
      password = 'verysecurepassword';
      action = tryLogin(username, password);
    });

    it('maps data to access token', () => {
      const data = {
        access_token: 'mockToken!'
      };
      expect(action[CALL_API].mapResponse(data)).toBe(data.access_token);
    });

    it('creates an api call action to login', () => {
      expect(action[CALL_API]).toMatchSnapshot();
    });
  });

  describe('logout', () => {
    let action;

    beforeEach(() => {
      action = logout();
    });

    it('creates an invalidate login action', () => {
      expect(action).toMatchSnapshot();
    });
  });
});