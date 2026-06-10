import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth-service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('kschool_user');
    const token = localStorage.getItem('kschool_token');

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    const { token, user } = res.data.data;
    localStorage.setItem('kschool_token', token);
    localStorage.setItem('kschool_user', JSON.stringify(user));
    setUser(user);
    return user;
  };

  const signup = async (data) => {
    return authService.signup(data);
  };

  const logout = () => {
    localStorage.removeItem('kschool_token');
    localStorage.removeItem('kschool_user');
    setUser(null);
  };

  const hasRole = (role) => {
    return user?.roles?.includes(role) || false;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
