import * as LoginActionTypes from '../actiontypes/login';

function login
(
  state = {
    isFetching: false,
    didInvalidate: false,
    token: localStorage.getItem('id') || null
  },
  action
) {
  switch (action.type) {
    case LoginActionTypes.INVALIDATE_LOGIN:
      localStorage.removeItem('id');
      return {
        ...state,
        token: null,
        didInvalidate: true
      };
    case LoginActionTypes.REQUEST_LOGIN:
      return {
        ...state,
        isFetching: true,
        didInvalidate: false
      };
    case LoginActionTypes.RECEIVE_LOGIN:
      localStorage.setItem('id', action.response);
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        token: action.response
      };
    case LoginActionTypes.FAILURE_LOGIN:
      return {
        ...state,
        isFetching: false
      };
    default:
      return state;
  }
}

export default login