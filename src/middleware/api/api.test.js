import * as callApi from './CallApi';
import apiDefault, { CALL_API } from "./api";
import { HTTP_ERROR } from "../http-error/http-error";
import pMinDelay from 'p-min-delay';

jest.mock('p-min-delay', () => jest.fn());

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

  afterEach(() => {
    jest.clearAllMocks();
  });

  // TODO: is returns rejected error and resolved response in dispatch(event).then()...
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

  it('waits for minimum delay to be reached', () => {
    const mockResponsePromise = jest.fn();
    const minimumDelay = 10240;

    callApi.default.mockReturnValue(mockResponsePromise);
    pMinDelay.mockReturnValue(Promise.resolve({
      data: true
    }));

    middleware({}, jest.fn(), {
      [CALL_API]: {
        ...valid,
        authenticate: false,
        minimumDelay
      }
    });

    expect(pMinDelay).toHaveBeenCalledWith(mockResponsePromise, minimumDelay, { delayRejection: false })
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

  it('rejects api error message', async () => {
    const message = '500 error';

    callApi.default.mockReturnValue(Promise.reject({
      response: {
        data: {
          message
        }
      }
    }));

    await expect(middleware(() => {}, next => next, {
      [CALL_API]: {
        ...valid,
        authenticate: false
      }
    })).rejects.toHaveProperty('error', message);
  });

  it('rejects a default error message if api doesn\'t supply it', async () => {
    callApi.default.mockReturnValue(Promise.reject({
      data: {}
    }));
    // const error = await middleware(() => {}, () => {}, valid);

    await expect(middleware(() => {}, next => next, {
      [CALL_API]: {
        ...valid,
        authenticate: false
      }
    })).rejects.toMatchObject({
      error: 'Something went wrong!',
    });
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
    it('dispatches failure type with action data with callApi error message', () => {
      expect.assertions(1);
      const message = 'A 500 error happened!';

      callApi.default.mockImplementation(() => Promise.reject({
        response: {
          data: {
            message
          }
        }
      }));

      return middleware(jest.fn(), mockDispatch, {
        ...actionData,
        [CALL_API]: {
          ...valid,
          authenticate: false
        }
      }).catch(() => {
        expect(mockDispatch.mock.calls[1][0]).toMatchObject({
          type: 'FAILURE',
          ...actionData,
          error: message
        });
      });
    });
    it('passes error statusCode to HttpError middleware', () => {
      expect.assertions(1);

      callApi.default.mockImplementation(() => Promise.reject({
        response: {
          status: 401
        }
      }));

      return middleware(jest.fn(), mockDispatch, {
        ...actionData,
        [CALL_API]: {
          ...valid,
          authenticate: false
        }
      }).catch(() => {
        expect(mockDispatch.mock.calls[1][0]).toMatchObject({
          [HTTP_ERROR]: {
            statusCode: 401
          }
        });
      });
    });
  });
});