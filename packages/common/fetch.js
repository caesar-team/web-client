import { API_URI, API_BASE_PATH } from './constants';
import { logger } from './utils/logger';

const baseURL = `${API_URI || process.env.API_URI}/${API_BASE_PATH ||
  process.env.API_BASE_PATH}`;

const fetchApi = (url, options) =>
  fetch(`${baseURL}${url}`, {
    method: 'GET',
    ...options,
    headers: {
      ...options.headers,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .catch(error => {
      logger.error('Error: %o', error);
    });

export const postSecureMessage = data =>
  fetchApi('/message', {
    method: 'POST',
    body: JSON.stringify(data),
  });
