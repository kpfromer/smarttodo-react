import * as LoginActionTypes from '../actiontypes/login';
import { CALL_API } from "../middleware/api/api";

export const tryLogin = (username, password) => ({
  [CALL_API]: {
    types: [
      LoginActionTypes.REQUEST_LOGIN,
      LoginActionTypes.RECEIVE_LOGIN,
      LoginActionTypes.FAILURE_LOGIN
    ],
    method: 'POST',
    endpoint: '/login',
    data: { username, password },
    authenticate: false,
    mapResponse: response => response.access_token
  }
});

export const logout = () => ({
  type: LoginActionTypes.INVALIDATE_LOGIN
});