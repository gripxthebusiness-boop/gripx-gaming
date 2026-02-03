
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionExpiry, setSessionExpiry] = useState(null);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Refs for performance optimization
  const activityTimeoutRef = useRef(null);
  const activityHandlerRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Performance: Increased session timeout check from 1 min to 5 mins
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  const EXTENDED_SESSION_TIMEOUT = 7 * 24 * 60 * 60 * 1000; // 7 days
  const SESSION_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes (reduced API calls)

  // Cache user data in localStorage for faster initial load
  const CACHED_USER_KEY = 'neosell_cached_user';

  // Track user activity for session management - optimized with single listener
  useEffect(() => {
    // Create handler once
    const updateActivity = () => {
      clearTimeout(activityTimeoutRef.current);
      activityTimeoutRef.current = setTimeout(() => {
        setLastActivity(Date.now());
      }, 1000);
    };
    
    activityHandlerRef.current = updateActivity;

    // Use a single event listener with event delegation for better performance
    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('click', updateActivity);
    window.addEventListener('scroll', updateActivity, { passive: true });

    return () => {
      clearTimeout(activityTimeoutRef.current);
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('click', updateActivity);
      window.removeEventListener('scroll', updateActivity);
    };
  }, []);

  // Check session expiry - reduced frequency
  useEffect(() => {
    const checkSession = () => {
      const isKeepSignedIn = localStorage.getItem('keepSignedIn') === 'true';
      const timeout = isKeepSignedIn ? EXTENDED_SESSION_TIMEOUT : SESSION_TIMEOUT;
      
      if (user && (Date.now() - lastActivity > timeout)) {
        logout();
        setError('Your session has expired due to inactivity. Please sign in again.');
      }
      
      setSessionExpiry(lastActivity + timeout);
    };

    const interval = setInterval(checkSession, SESSION_CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, [user, lastActivity]);

  // Check if user is logged in on mount - with cached data for instant load
  useEffect(() => {
    if (token) {
      // Use cached user data for instant display
      const cachedUser = localStorage.getItem(CACHED_USER_KEY);
      if (cachedUser) {
        try {
          setUser(JSON.parse(cachedUser));
        } catch (e) {
          localStorage.removeItem(CACHED_USER_KEY);
        }
      }
      // Verify token in background (debounced)
      const timer = setTimeout(() => verifyToken(), 500);
      return () => clearTimeout(timer);
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
    // Prevent duplicate verification calls
    if (isVerifying) return;
    
    try {
      setIsVerifying(true);
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        // Cache user data for faster initial load
        localStorage.setItem(CACHED_USER_KEY, JSON.stringify(userData));
        // Extend session on token verification
        setLastActivity(Date.now());
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem(CACHED_USER_KEY);
        setToken(null);
        setUser(null);
      }
    } catch (err) {
      console.error('Token verification failed:', err);
      setError(err.message);
    } finally {
      setIsVerifying(false);
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
      // Cache user data for faster initial loads
      localStorage.setItem(CACHED_USER_KEY, JSON.stringify(data.user));
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
    localStorage.removeItem(CACHED_USER_KEY);
    setToken(null);
    setUser(null);
    setLastActivity(Date.now());
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      // Update user in state and cache
      setUser(data.user);
      localStorage.setItem(CACHED_USER_KEY, JSON.stringify(data.user));

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password');
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async (password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/auth/account`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete account');
      }

      // Logout after successful account deletion
      logout();

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

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
        updateProfile,
        changePassword,
        deleteAccount,
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

