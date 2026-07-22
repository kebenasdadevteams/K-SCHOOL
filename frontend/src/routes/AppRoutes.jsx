import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Public pages
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import ResourcesPage from '../pages/ResourcesPage';
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import RoleSelectionPage from '../pages/auth/RoleSelectionPage';

// Dashboards
import StudentDashboard from '../dashboards/student/StudentDashboard';
import TeacherDashboard from '../dashboards/teacher/TeacherDashboard';
import PastorDashboard from '../dashboards/pastor/PastorDashboard';
import EditorDashboard from '../dashboards/editor/EditorDashboard';
import DeveloperDashboard from '../dashboards/developer/DeveloperDashboard';
import AdminDashboard from '../dashboards/admin/AdminDashboard';

import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/resources" element={<ResourcesPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Role selection */}
      {/* role-selection removed; redirect to home if accessed */}
      <Route path="/role-selection" element={<Navigate to="/" replace />} />

      {/* Dashboards */}
      <Route path="/dashboard" element={<Navigate to="/student" replace />} />
      <Route path="/student/*" element={
        <ProtectedRoute requiredRole="student">
          <StudentDashboard />
        </ProtectedRoute>
      } />
      <Route path="/teacher/*" element={
        <ProtectedRoute requiredRole="teacher">
          <TeacherDashboard />
        </ProtectedRoute>
      } />
      <Route path="/pastor/*" element={
        <ProtectedRoute requiredRole="pastor">
          <PastorDashboard />
        </ProtectedRoute>
      } />
      <Route path="/editor/*" element={
        <ProtectedRoute requiredRole="editor">
          <EditorDashboard />
        </ProtectedRoute>
      } />
      <Route path="/developer/*" element={
        <ProtectedRoute requiredRole="developer">
          <DeveloperDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/*" element={
        <ProtectedRoute requiredRole="admin">
          <AdminDashboard />
        </ProtectedRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
