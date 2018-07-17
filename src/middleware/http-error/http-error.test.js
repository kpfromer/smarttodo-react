import httpError, { HTTP_ERROR } from './http-error';

describe('HttpError middleware', () => {
  let httpErrorMiddleware, mockThunk, mockDispatch;

  beforeEach(() => {
    mockThunk = jest.fn();
    mockDispatch = jest.fn();

    httpErrorMiddleware = httpError([
      {
        statusCode: 400,
        action: mockThunk
      }
    ]);
  });

  describe('when http error', () => {
    let otherActionData;

    beforeEach(() => {
      otherActionData = {
        type: 'API_ERROR',
        data: {
          number: true
        }
      };

      httpErrorMiddleware(undefined)(mockDispatch)({
        ...otherActionData,
        [HTTP_ERROR]: {
          statusCode: 400
        }
      });
    });

    it('dispatches original action without http error info', () => {
        expect(mockDispatch).toHaveBeenCalledWith(otherActionData);
    });
    it('passes dispatch to a thunk if it\'s statusCode matches that from api call', () => {
      expect(mockThunk).toHaveBeenCalledWith(mockDispatch);
    });
  });

  describe('no error', () => {
    let action;

    beforeEach(() => {
      action = {
        type: 'NO_ERROR'
      };
      httpError([])(undefined)(mockDispatch)(action);
    });

    it('does\'nt call thunk', () => {
      expect(mockThunk).not.toHaveBeenCalled();
    });

    it('dispatches the next action', () => {
      expect(mockDispatch).toHaveBeenCalledWith(action);
    })
  });
});