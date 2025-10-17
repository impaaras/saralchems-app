import axios from 'axios';
import {API_URL} from '../utils/ApiService';
import {storage, StorageKeys, setItem} from '../utils/storage';
import {store} from '../redux/store';
import {logout} from './slices/authSlice';

const api = axios.create({
  baseURL: API_URL,
});

// Attach access token
api.interceptors.request.use(
  async config => {
    const token = storage.getString(StorageKeys.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

// Handle expired token → refresh automatically
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refreshToken = storage.getString(StorageKeys.REFRESH_TOKEN);
      if (!refreshToken) {
        storage.clearAll();
        store.dispatch(logout());
        return Promise.reject(error);
      }

      try {
        const {data} = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        // Save new tokens
        setItem(StorageKeys.AUTH_TOKEN, data.accessToken);
        if (data.refreshToken)
          setItem(StorageKeys.REFRESH_TOKEN, data.refreshToken);

        // Retry original request with new access token
        originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        storage.clearAll();
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
