import { API_ROOT } from "./api";
import axios from 'axios';

export default (endpoint, method, mapResponse = value => value, data = undefined, token = undefined) => {

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
