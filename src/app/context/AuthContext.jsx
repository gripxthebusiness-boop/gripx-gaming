
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionExpiry, setSessionExpiry] = useState(null);
  const [lastActivity, setLastActivity] = useState(Date.now());

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Session timeout settings (30 minutes of inactivity)
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  const EXTENDED_SESSION_TIMEOUT = 7 * 24 * 60 * 60 * 1000; // 7 days (for "Keep me signed in")

  // Track user activity for session management
  useEffect(() => {
    const updateActivity = () => setLastActivity(Date.now());
    
    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keypress', updateActivity);
    window.addEventListener('click', updateActivity);
    window.addEventListener('scroll', updateActivity);

    return () => {
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keypress', updateActivity);
      window.removeEventListener('click', updateActivity);
      window.removeEventListener('scroll', updateActivity);
    };
  }, []);

  // Check session expiry
  useEffect(() => {
    const checkSession = () => {
      const isKeepSignedIn = localStorage.getItem('keepSignedIn') === 'true';
      const timeout = isKeepSignedIn ? EXTENDED_SESSION_TIMEOUT : SESSION_TIMEOUT;
      
      if (user && (Date.now() - lastActivity > timeout)) {
        // Session expired due to inactivity
        logout();
        setError('Your session has expired due to inactivity. Please sign in again.');
      }
      
      setSessionExpiry(lastActivity + timeout);
    };

    const interval = setInterval(checkSession, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [user, lastActivity]);

  // Check if user is logged in on mount
  useEffect(() => {
    if (token) {
      verifyToken();
    }
  }, []);

  // Password strength validator (Amazon-style requirements)
  const validatePasswordStrength = useCallback((password) => {
    const requirements = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[^A-Za-z0-9]/.test(password),
    };

    const score = Object.values(requirements).filter(Boolean).length;
    
    let strength = 'weak';
    if (score >= 5) strength = 'strong';
    else if (score >= 4) strength = 'good';
    else if (score >= 3) strength = 'fair';

    return {
      requirements,
      score,
      strength,
      isValid: requirements.minLength && requirements.hasUppercase && 
               requirements.hasLowercase && requirements.hasNumber
    };
  }, []);

  // Get remaining session time
  const getSessionTimeRemaining = useCallback(() => {
    if (!sessionExpiry) return 0;
    return Math.max(0, sessionExpiry - Date.now());
  }, [sessionExpiry]);

  const verifyToken = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        // Extend session on token verification
        setLastActivity(Date.now());
      } else {
        localStorage.removeItem('token');
        setToken(null);
      }
    } catch (err) {
      console.error('Token verification failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      setLastActivity(Date.now());

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('keepSignedIn');
    setToken(null);
    setUser(null);
    setLastActivity(Date.now());
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        sessionExpiry,
        sessionTimeRemaining: getSessionTimeRemaining(),
        login,
        register,
        logout,
        clearError,
        validatePasswordStrength,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isEditor: user?.role === 'editor' || user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

