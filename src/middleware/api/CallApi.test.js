import callApi from "./CallApi";
import axios from 'axios';
import { API_ROOT } from "./api";

jest.mock('axios', () => jest.fn());

describe('callApi', () => {
  let fetch;

  beforeEach(() => {
    fetch = axios;
  });

  afterEach(() => {
    fetch.mockClear();
  });

  it('calls the api', async () => {
    fetch.mockImplementation(() => Promise.resolve([]));
    const method = 'GET';

    await callApi('/', method);

    expect(fetch.mock.calls[0][0]).toEqual(expect.objectContaining({
      method
    }));
  });
  it('calls api with content type of json', async () => {
    fetch.mockImplementation(() => Promise.resolve([]));
    await callApi('/', 'GET');

    expect(fetch.mock.calls[0][0]).toEqual(expect.objectContaining({
      headers: expect.objectContaining({
        'Content-Type': 'application/json'
      })
    }));
  });
  it('resolves api data', async () => {
    const mockResult = {
      name: 'kyle'
    };
    fetch.mockImplementation(() => Promise.resolve({
      data: mockResult
    }));

    const apiResult = await callApi('/', 'GET');

    expect(apiResult).toBe(mockResult);
  });
  it('rejects api errors', async () => {
    const error = 'A 500 api error!';
    fetch.mockImplementation(() => Promise.reject(error));

    const handler = async () => await callApi('/', 'GET');

    await expect(handler()).rejects.toBe(error);
  });

  describe('given `endpoint`', () => {
    it('calls api with `endpoint` with attached base api url', async () => {
      fetch.mockImplementation(() => Promise.resolve([]));
      const endPoint = '/todo';

      await callApi(endPoint, 'GET');

      expect(fetch.mock.calls[0][0].url).toBe(API_ROOT + endPoint);
    });
    it('calls api with `endpoint` if it already has the base api url', async () => {
      fetch.mockImplementation(() => Promise.resolve([]));
      const endPoint = `${API_ROOT}/todo`;

      await callApi(endPoint, 'GET');

      expect(fetch.mock.calls[0][0].url).toBe(endPoint);
    });
  });

  describe('given `mapResponse`', () => {
    it('resolves mapped api result', async () => {
      const mockResult = {
        items: {
          todos: [
            {
              hello: 'hi!'
            }
          ]
        }
      };

      fetch.mockImplementation(() => Promise.resolve({
        data: mockResult
      }));

      const mapResponse = res => res.items.todos;

      expect(await callApi('/', 'GET', mapResponse)).toBe(mockResult.items.todos);
    });
  });

  describe('given `data`', () => {
    it('attaches data to api call', async () => {
      const data = jest.fn();

      await callApi('/', 'POST', undefined, data);

      expect(fetch.mock.calls[0][0].data).toBe(data);
    });
  });

  describe('given `token`', () => {
    it('attaches a bearer authorization header', async () => {
      const token = 'a-long-jwt-token';

      await callApi('/', 'POST', undefined, undefined, token);

      expect(fetch.mock.calls[0][0]).toMatchObject({
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    });
  });
});
