import axios from 'axios';

const TOKEN_KEY = 'forage_token';

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

// One client for the whole app: base URL, auth header, timeout and error shape live here.
// AI calls can take several seconds, so the timeout is generous.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 60000,
});

api.interceptors.request.use((request) => {
  const token = tokenStore.get();
  if (token) request.headers.Authorization = `Bearer ${token}`;
  return request;
});

api.interceptors.response.use(
  (response) => response.data.data,
  (error) => {
    const status = error.response?.status;
    const body = error.response?.data;
    if (status === 401 && tokenStore.get()) {
      tokenStore.clear();
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    const message = body?.message
      ?? (error.code === 'ECONNABORTED' ? 'The request took too long. Please try again.' : 'We could not reach the server. Check your connection and try again.');
    return Promise.reject(new ApiError(message, status, body?.error?.details));
  },
);
