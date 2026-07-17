import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-primary text-xl font-display animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    const normalizedRole = String(requiredRole).trim().toLowerCase();
    const userRoles = Array.isArray(user.roles)
      ? user.roles.map((role) => String(role).trim().toLowerCase())
      : [];

    const canAccess = userRoles.includes(normalizedRole)
      || (normalizedRole === 'student' && ['teacher', 'pastor', 'editor', 'admin', 'developer'].some((role) => userRoles.includes(role)));

    if (!canAccess) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
