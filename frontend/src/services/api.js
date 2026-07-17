import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api/v1`
    : 'http://localhost:5000/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('kschool_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const requestUrl = err.config?.url || '';

    if (status === 401 && requestUrl.includes('/auth/login')) {
      // Allow the login page to handle invalid credentials without a forced redirect.
      return Promise.reject(err);
    }

    if (status === 401 && localStorage.getItem('kschool_token')) {
      localStorage.removeItem('kschool_token');
      localStorage.removeItem('kschool_user');
      window.location.href = '/login';
    }

    return Promise.reject(err);
  }
);

export default api;
