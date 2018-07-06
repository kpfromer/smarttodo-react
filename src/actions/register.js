import { CALL_API } from "../middleware/api/api";
import { FAILURE_REGISTER, RECEIVE_REGISTER, REQUEST_REGISTER } from "../actiontypes/register";

export const tryRegister = (username, password, email, firstName, lastName) => ({
  [CALL_API]: {
    types: [
      REQUEST_REGISTER,
      RECEIVE_REGISTER,
      FAILURE_REGISTER
    ],
    method: 'POST',
    endpoint: '/register',
    data: {
      username,
      password,
      email,
      firstName,
      lastName
    },
    authenticate: false
  }
});
