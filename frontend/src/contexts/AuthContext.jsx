import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth-service';

const AuthContext = createContext(null);

const normalizeRoles = (roles) => {
  if (!Array.isArray(roles)) return [];
  return roles.map((role) => String(role).trim().toLowerCase()).filter(Boolean);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticating, setAuthenticating] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('kschool_user');
    const token = localStorage.getItem('kschool_token');

    if (storedUser && token) {
      const parsedUser = JSON.parse(storedUser);
      setUser({
        ...parsedUser,
        roles: normalizeRoles(parsedUser.roles),
      });
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    setAuthenticating(true);
    try {
      const res = await authService.login(credentials);
      const { token, user } = res.data.data;
      const normalizedUser = {
        ...user,
        roles: normalizeRoles(user.roles),
      };
      localStorage.setItem('kschool_token', token);
      localStorage.setItem('kschool_user', JSON.stringify(normalizedUser));
      setUser(normalizedUser);
      return normalizedUser;
    } finally {
      setAuthenticating(false);
    }
  };

  const signup = async (data) => {
    setAuthenticating(true);
    try {
      return await authService.signup(data);
    } finally {
      setAuthenticating(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('kschool_token');
    localStorage.removeItem('kschool_user');
    setUser(null);
  };

  const hasRole = (role) => {
    if (!user?.roles) return false;
    return user.roles.includes(String(role).trim().toLowerCase());
  };

  const isLoading = loading || authenticating;

  return (
    <AuthContext.Provider value={{ user, loading: isLoading, login, signup, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
