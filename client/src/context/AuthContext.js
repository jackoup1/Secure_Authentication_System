import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/auth';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = authService.getUser();
          if (userData) {
            setUser(userData);
          } else {
            // If token is invalid or expired, clean up
            localStorage.removeItem('token');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Setup interval to periodically check token validity
    const checkInterval = setInterval(() => {
      const userData = authService.getUser();
      if (!userData && user) {
        // Token has expired, update state
        setUser(null);
        localStorage.removeItem('token');
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkInterval);
  }, [user]);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    if (data.token) {
      const userData = authService.getUser();
      setUser(userData);
    }
    return data;
  };

  const signup = async (userData) => {
    const data = await authService.signup(userData);
    return data;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    window.location.replace('/login');
  };

  const githubLogin = async (token) => {
    try {
      if (token) {
        localStorage.setItem('token', token);
        const userData = authService.getUser();
        setUser(userData);
        window.location.replace('/dashboard');
      }
    } catch (err) {
      console.error('Invalid GitHub token', err);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      signup, 
      logout,
      githubLogin 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };