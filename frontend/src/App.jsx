import React from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/Shared/Header';
import AppRoutes from './routes/AppRoutes';

function AppContent() {
  const { pathname } = useLocation();
  const isDashboardRoute = /^\/(dashboard|student|teacher|pastor|editor|developer|admin)(\/|$)/.test(pathname);

  return (
    <div className="app">
      {!isDashboardRoute && <Header />}
      <AppRoutes />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
