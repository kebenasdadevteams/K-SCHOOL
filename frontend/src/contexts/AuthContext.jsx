// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth-service';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from 'firebase/auth';

// Firebase configuration - using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase only if config exists
let firebaseAuth = null;
let googleProvider = null;

try {
  // Check if we have the required config
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== 'your_api_key_here') {
    const app = initializeApp(firebaseConfig);
    firebaseAuth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
    console.log('✅ Firebase initialized successfully');
  } else {
    console.warn('⚠️ Firebase not configured. Google Sign-In will not work.');
  }
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
}

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
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({
          ...parsedUser,
          roles: normalizeRoles(parsedUser.roles),
        });
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('kschool_user');
        localStorage.removeItem('kschool_token');
      }
    }
    setLoading(false);
  }, []);

  // Login with email/password
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
    } catch (error) {
      throw error;
    } finally {
      setAuthenticating(false);
    }
  };

  // Signup with email/password
  const signup = async (data) => {
    setAuthenticating(true);
    try {
      return await authService.signup(data);
    } catch (error) {
      throw error;
    } finally {
      setAuthenticating(false);
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    if (!firebaseAuth || !googleProvider) {
      throw new Error('Google Sign-In is not configured. Please check your Firebase configuration.');
    }

    setAuthenticating(true);
    try {
      // Step 1: Sign in with Google using Firebase
      const result = await signInWithPopup(firebaseAuth, googleProvider);
      const { user: firebaseUser } = result;
      
      // Get the ID token
      const idToken = await firebaseUser.getIdToken();
      
      // Step 2: Send the ID token to your backend
      const response = await authService.googleAuth({
        idToken: idToken,
        email: firebaseUser.email,
        full_name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Google User',
        avatar: firebaseUser.photoURL || '',
        googleId: firebaseUser.uid,
      });
      
      const { token, user: backendUser } = response.data.data;
      const normalizedUser = {
        ...backendUser,
        roles: normalizeRoles(backendUser.roles),
        avatar: backendUser.avatar || firebaseUser.photoURL || '',
      };
      
      localStorage.setItem('kschool_token', token);
      localStorage.setItem('kschool_user', JSON.stringify(normalizedUser));
      setUser(normalizedUser);
      
      return normalizedUser;
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      // If there's a Firebase error, try to sign out from Firebase
      if (firebaseAuth) {
        try {
          await firebaseSignOut(firebaseAuth);
        } catch (signOutError) {
          console.error('Error signing out from Firebase:', signOutError);
        }
      }
      throw error;
    } finally {
      setAuthenticating(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      // Sign out from Firebase if available
      if (firebaseAuth) {
        try {
          await firebaseSignOut(firebaseAuth);
        } catch (error) {
          console.error('Firebase sign out error:', error);
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('kschool_token');
      localStorage.removeItem('kschool_user');
      setUser(null);
    }
  };

  const hasRole = (role) => {
    if (!user?.roles) return false;
    return user.roles.includes(String(role).trim().toLowerCase());
  };

  const isLoading = loading || authenticating;

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading: isLoading, 
        login, 
        signup, 
        signInWithGoogle,
        logout, 
        hasRole,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};