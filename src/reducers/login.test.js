import LoginReducer from './login';
import * as LoginActionTypes from "../actiontypes/login";

describe('login reducer', () => {
  let mockGetItem, mockSetItem, mockRemoveItem;

  beforeEach(() => {
    // SEE https://github.com/facebook/jest/issues/6858#issuecomment-413677180 for more information about about localStorage mocking with jest
    mockGetItem = jest.spyOn(Storage.prototype, 'getItem');
    mockSetItem = jest.spyOn(Storage.prototype, 'setItem');
    mockRemoveItem = jest.spyOn(Storage.prototype, 'removeItem');
  });

  it('defaults to not fetching', () => {
    expect(LoginReducer(undefined, 'nsot an action')).toMatchSnapshot();
  });

  it('by default it gets the id from local storage', () => {
    const mockToken = 'jwt-token-in-local-storage';
    mockGetItem.mockReturnValue(mockToken);
    expect(LoginReducer(undefined, 'not an action').token).toBe(mockToken);
    expect(mockGetItem).toHaveBeenCalledWith('id');
  });

  describe('INVALIDATE_LOGIN', () => {
    let result;

    beforeEach(() => {
      result = LoginReducer(undefined, {
        type: LoginActionTypes.INVALIDATE_LOGIN
      });
    });

    it('removes id from local storage', () => {
      expect(mockRemoveItem).toHaveBeenCalledWith('id');
    });

    it('removes token', () => {
      expect(result).toMatchSnapshot();
    });
  });

  describe('RECEIVE_LOGIN', () => {
    let result, token;

    beforeEach(() => {
      token = 'mock-jwt-token-from-api';
      result = LoginReducer(undefined, {
        type: LoginActionTypes.RECEIVE_LOGIN,
        response: token
      });
    });

    it('sets id in local storage', () => {
      expect(mockSetItem).toHaveBeenCalledWith('id', token);
    });

    it('sets token in state ', () => {
      expect(result).toMatchSnapshot();
    });
  });

  describe('REQUEST_LOGIN', () => {
    it('displays spinner', () => {
      const result = LoginReducer(undefined, {
        type: LoginActionTypes.REQUEST_LOGIN
      });
      expect(result).toMatchSnapshot();
    });
  });

  describe('RECEIVE_LOGIN', () => {
    it('closes spinner', () => {
      const result = LoginReducer({ isFetching: true }, {
        type: LoginActionTypes.RECEIVE_LOGIN
      });

      expect(result).toMatchObject({
        isFetching: false
      });
    });
  });

  describe('FAILURE_LOGIN', () => {
    it('closes spinner', () => {
      const result = LoginReducer({ isFetching: true }, {
        type: LoginActionTypes.FAILURE_LOGIN
      });

      expect(result).toMatchObject({
        isFetching: false
      });

    });
  });
});