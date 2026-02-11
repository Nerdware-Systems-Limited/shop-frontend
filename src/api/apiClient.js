import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Track if we're currently refreshing to prevent multiple refresh requests
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request interceptor - Add access token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle token refresh on 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is not 401 or request already retried, reject immediately
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Check if this is a token refresh request that failed
    if (originalRequest.url?.includes('/auth/token/refresh/')) {
      // Refresh token is invalid, clear everything and redirect to login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      isRefreshing = false;
      processQueue(error, null);
      
      // Dispatch logout event for Redux state cleanup
      window.dispatchEvent(new Event('token-expired'));
      
      return Promise.reject(error);
    }

    // If we're already refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        })
        .catch(err => {
          return Promise.reject(err);
        });
    }

    // Mark that we're attempting to refresh
    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = localStorage.getItem('refreshToken');

    // If no refresh token exists, clear storage and reject
    if (!refreshToken) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      isRefreshing = false;
      window.dispatchEvent(new Event('token-expired'));
      return Promise.reject(error);
    }

    try {
      // Attempt to refresh the access token
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/auth/token/refresh/`,
        { refresh: refreshToken }
      );

      // Store new access token
      localStorage.setItem('accessToken', data.access);
      
      // If a new refresh token is provided (rotation enabled), store it
      if (data.refresh) {
        localStorage.setItem('refreshToken', data.refresh);
      }

      // Update the authorization header
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
      originalRequest.headers.Authorization = `Bearer ${data.access}`;

      // Process all queued requests with the new token
      processQueue(null, data.access);
      isRefreshing = false;

      // Retry the original request with the new token
      return apiClient(originalRequest);
    } catch (refreshError) {
      // Refresh failed - clear everything and reject
      processQueue(refreshError, null);
      isRefreshing = false;
      
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      // Dispatch logout event for Redux state cleanup
      window.dispatchEvent(new Event('token-expired'));
      
      return Promise.reject(refreshError);
    }
  }
);

export default apiClient;