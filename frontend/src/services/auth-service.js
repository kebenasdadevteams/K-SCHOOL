// src/services/auth-service.js
import api from './api';

export const authService = {
  // Existing login method
  login: (credentials) => api.post('/auth/login', credentials),
  
  // Existing signup method
  signup: (data) => api.post('/auth/signup', data),
  
  // New Google authentication method
  googleAuth: (data) => api.post('/auth/google', data),
  
  // Get current user profile
  getProfile: () => api.get('/auth/me'),
  
  // Forgot password
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  
  // Reset password
  resetPassword: (data) => api.post('/auth/reset-password', data),
};