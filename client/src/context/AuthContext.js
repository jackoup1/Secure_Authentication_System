import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/auth';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await authService.checkAuth();
        setUser(result ? result.user : null);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    if (data.token) {
      const decodedToken = JSON.parse(atob(data.token.split('.')[1]));
      setUser({ id: decodedToken.id, username: decodedToken.username });
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
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        setUser({ id: decodedToken.id, username: decodedToken.username });
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