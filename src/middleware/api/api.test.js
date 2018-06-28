import * as callApi from './CallApi';
import apiDefault, { CALL_API } from "./api";


describe('api middleware', () => {
  let middleware, valid;

  beforeEach(() => {

    jest.spyOn(callApi, 'default');

    const setupMiddleware = apiDefault();
    middleware = (store, next, action) => setupMiddleware(store)(next)(action);

    valid = {
      endpoint: '/',
      types: ['REQUEST', 'SUCCESS', 'FAILURE'],
      method: 'GET'
    }
  });

  it('errors if endpoint is not a string', () => {
    const handler = () => {
      middleware(undefined, undefined, {
        [CALL_API]: {
          ...valid,
          endpoint: 123
        }
      })
    };

    expect(handler).toThrowErrorMatchingSnapshot();
  });
  it('errors if there are not three types', () => {
    const handler = () => {
      middleware(undefined, undefined, {
        [CALL_API]: {
          ...valid,
          types: ['REQUEST', 'FAILURE']
        }
      })
    };

    expect(handler).toThrowErrorMatchingSnapshot();
  });
  it('errors if types are not strings', () => {
    const handler = () => {
      middleware(undefined, undefined, {
        [CALL_API]: {
          ...valid,
          types: ['REQUEST', 'SUCCESS', 123]
        }
      })
    };

    expect(handler).toThrowErrorMatchingSnapshot();
  });
  it('errors if method is not valid method', () => {
    const handler = () => {
      middleware(undefined, undefined, {
        [CALL_API]: {
          ...valid,
          method: 'NOT_A_HTTP_METHOD'
        }
      })
    };

    expect(handler).toThrowErrorMatchingSnapshot();
  });
  it('errors if data is not included and method is a creation type', () => {
    const handler = () => {
      middleware(undefined, undefined, {
        [CALL_API]: {
          ...valid,
          method: 'POST',
          data: null
        }
      })
    };

    expect(handler).toThrowErrorMatchingSnapshot();
  });

  it('calls api with token if `authenticate`', () => {
    callApi.default.mockReturnValue(Promise.resolve([]));

    const token = 'a-jwt-token';
    const mockStore = {
      getState: () => ({ login: { token }})
    };

    const setupMiddleware = apiDefault({
      getAuthFromState: state => state.login.token
    });
    setupMiddleware(mockStore)(jest.fn())({
      [CALL_API]: {
        ...valid,
        authenticate: true
      }
    });

    expect(callApi.default.mock.calls[0][4]).toBe(token);
  });

  describe('dispatch', () => {
    let actionData, mockDispatch;
    beforeEach(() => {
      mockDispatch = jest.fn();

      actionData = {
        hello: 'world',
        firstName: 'jack',
        lastName: 'nick'
      };
    });

    it('dispatches request type with action data immediately', () => {
      middleware(jest.fn(), mockDispatch, {
        ...actionData,
        [CALL_API]: {
          ...valid,
          authenticate: false
        }
      });

      expect(mockDispatch.mock.calls[0][0]).toEqual({
        type: 'REQUEST',
        ...actionData
      });
    });
    it('dispatches success type with action data with callApi response', async () => {
      const apiData = {
        todos: [
          {
            api: 'data'
          }
        ]
      };

      callApi.default.mockReturnValue(Promise.resolve(apiData));

      await middleware(jest.fn(), mockDispatch, {
        ...actionData,
        [CALL_API]: {
          ...valid,
          authenticate: false
        }
      });

      expect(mockDispatch.mock.calls[1][0]).toEqual({
        type: 'SUCCESS',
        ...actionData,
        response: apiData
      });
    });
    it('dispatches failure type with action data with callApi error message', async () => {
      const message = 'A 500 error happened!';

      callApi.default.mockReturnValue(Promise.reject({
        message
      }));

      await middleware(jest.fn(), mockDispatch, {
        ...actionData,
        [CALL_API]: {
          ...valid,
          authenticate: false
        }
      });

      expect(mockDispatch.mock.calls[1][0]).toEqual({
        type: 'FAILURE',
        ...actionData,
        error: message
      });
    });
  });
});