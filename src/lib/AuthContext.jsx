import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  supabase, 
  getCurrentUser, 
  signInWithEmail, 
  signUpWithEmail,
  signInWithOAuth,
  signOut,
  onAuthStateChange 
} from './supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    checkUserAuth();

    // Listen for auth state changes
    const { data: { subscription } } = onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setUser(session.user);
        setIsAuthenticated(true);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkUserAuth = async () => {
    try {
      setIsLoadingAuth(true);
      const currentUser = await getCurrentUser();
      
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('User auth check failed:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const login = async (email, password) => {
    try {
      setAuthError(null);
      const { data, error } = await signInWithEmail(email, password);
      if (error) throw error;
      setUser(data.user);
      setIsAuthenticated(true);
      return data;
    } catch (error) {
      setAuthError({
        type: 'login_failed',
        message: error.message || 'Login failed'
      });
      throw error;
    }
  };

  const signup = async (email, password) => {
    try {
      setAuthError(null);
      const { data, error } = await signUpWithEmail(email, password);
      if (error) throw error;
      return data;
    } catch (error) {
      setAuthError({
        type: 'signup_failed',
        message: error.message || 'Signup failed'
      });
      throw error;
    }
  };

  const loginWithOAuth = async (provider) => {
    try {
      setAuthError(null);
      const { data, error } = await signInWithOAuth(provider);
      if (error) throw error;
      return data;
    } catch (error) {
      setAuthError({
        type: 'oauth_failed',
        message: error.message || 'OAuth login failed'
      });
      throw error;
    }
  };

  const logout = async (shouldRedirect = true) => {
    try {
      await signOut();
      setUser(null);
      setIsAuthenticated(false);
      
      if (shouldRedirect) {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navigateToLogin = () => {
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      login,
      signup,
      loginWithOAuth,
      logout,
      navigateToLogin,
      checkUserAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
