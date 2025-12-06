import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
    
    // Listen for auth state changes
    const subscription = authService.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setUser(session?.user || null);
        setIsAuthenticated(!!session);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    };
  }, []);

  const checkSession = async () => {
    try {
      const { success, session, user: currentUser } = await authService.getCurrentSession();
      if (success && session) {
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking session:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, userData = {}) => {
    try {
      const result = await authService.signUp(email, password, userData);
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
      }
      return result;
    } catch (error) {
      console.error('Sign up error:', error);
      return {
        success: false,
        error: error.message || 'An error occurred during sign up',
      };
    }
  };

  const signIn = async (email, password) => {
    try {
      const result = await authService.signIn(email, password);
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
      }
      return result;
    } catch (error) {
      console.error('Sign in error:', error);
      return {
        success: false,
        error: error.message || 'An error occurred during sign in',
      };
    }
  };

  const signOut = async () => {
    try {
      const result = await authService.signOut();
      if (result.success) {
        setUser(null);
        setIsAuthenticated(false);
      }
      return result;
    } catch (error) {
      console.error('Sign out error:', error);
      return {
        success: false,
        error: error.message || 'An error occurred during sign out',
      };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

