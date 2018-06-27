import axios from 'axios';

export const API_ROOT = 'http://localhost:3001/v1';
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

export const callApi = (endpoint, method, mapResponse = value => value, data = undefined, token = undefined) => {

  const fullUrl = endpoint.includes(API_ROOT) ? endpoint : API_ROOT + endpoint;

  return axios({
    url: fullUrl,
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : undefined
    },
    data
  })
    .then(response => mapResponse(response.data))
    .catch(error => Promise.reject(error));
};

export default store => next => action => {
  const callAPI = action[CALL_API];

  if (typeof callAPI === 'undefined') {
    return next(action);
  }

  let { endpoint } = callAPI;
  const { types, mapResponse, method, data, authenticate = true } = callAPI;

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
    throw new Error(`Invalid call api type: ${method}`);
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
    token = store.getState().login.token;
  }

  const [requestType, successType, failureType] = types;
  next(actionWith({ type: requestType }));

  return callApi(endpoint, method, mapResponse, data, token).then(
    response => next(actionWith({
      response,
      type: successType
    })),
    error => next(actionWith({
      type: failureType,
      error: error.message || 'Something bad happened'
    }))
  )
};
