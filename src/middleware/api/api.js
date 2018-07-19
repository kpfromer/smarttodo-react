import CallApi from './CallApi';
import { get } from 'lodash';
import { HTTP_ERROR } from "../http-error/http-error";
import pMinDelay from 'p-min-delay';

// TODO: TEST!
let apiRoot = 'http://localhost:3001/v1';

if (process.env.NODE_ENV === 'production') {
  apiRoot = process.env.REACT_APP_API_ROOT;
}
export const API_ROOT = apiRoot;

export const CALL_API = 'call/CALL_API';

const CREATE_TYPES = [
  'POST',
  'PUT'
];
const VALID_TYPES = [
  ...CREATE_TYPES,
  'GET',
  'DELETE'
];

export default ({ getAuthFromState } = { getAuthFromState: val => val }) => store => next => action => {
  const callAPI = action[CALL_API];

  if (typeof callAPI === 'undefined') {
    return next(action);
  }

  let { endpoint } = callAPI;
  const { types, mapResponse, method, data, authenticate = true, minimumDelay = 0 } = callAPI;

  if (typeof endpoint === 'function') {
    endpoint = endpoint(store.getState())
  }

  if (typeof endpoint !== 'string') {
    throw new Error('Specify a string endpoint URL.')
  }
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.')
  }
  if (!types.every(type => typeof type === 'string')) {
    throw new Error('Expected action types to be strings.')
  }

  if (!VALID_TYPES.includes(method)) {
    throw new Error(`Invalid call api method: ${method}`);
  }

  if (CREATE_TYPES.includes(method) && !data) {
    throw new Error(`Method: ${method} requires data. Data is currently: ${data}`);
  }

  const actionWith = data => {
    const finalAction = { ...action, ...data };
    delete finalAction[CALL_API];
    return finalAction;
  };

  let token;

  if (authenticate) {
    token = getAuthFromState(store.getState());
  }

  const [requestType, successType, failureType] = types;
  next(actionWith({ type: requestType }));

  let apiCall = CallApi(endpoint, method, mapResponse, data, token);

  if (minimumDelay) {
    apiCall = pMinDelay(apiCall, minimumDelay, { delayRejection: false });
  }

  return apiCall
    .then(response => next(actionWith({
      response,
      type: successType
    })),
    error => {
      const defaultMessage = 'Something went wrong!';
      let errorMessage = get(error, 'response.data.message', defaultMessage);

      if (typeof errorMessage !== 'string') { // todo: fix so errorMessage can be an array
        errorMessage = defaultMessage;
      }

      const statusCode = get(error, 'response.status');

      return Promise.reject(next(actionWith({
        [HTTP_ERROR]: {
          statusCode
        },
        type: failureType,
        error: errorMessage // todo fix with backend when constraints don't match!
      })))
    }
  )
};
