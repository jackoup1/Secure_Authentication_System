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
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Setup interval to periodically check token validity
    const checkInterval = setInterval(() => {
      const token = localStorage.getItem('token');
      if (token) {
        const userData = authService.getUser();
        if (!userData) {
          // Token has expired, update state
          setUser(null);
          localStorage.removeItem('token');
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkInterval);
  }, []); // Remove user dependency

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    if (data.token) {
      const userData = authService.getUser();
      setUser(userData);
      window.location.replace('/dashboard');
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
        // First get the IP address
        let ipAddress = null;
        try {
          const ipResponse = await fetch('https://api.ipify.org?format=json');
          const ipData = await ipResponse.json();
          ipAddress = ipData.IPv4 || ipData.ip;
          console.log('IP Response:', ipData);
        } catch (ipError) {
          console.warn('Could not fetch IP address:', ipError);
          // Try alternative IP service if first one fails
          try {
            const altIpResponse = await fetch('https://api64.ipify.org?format=json');
            const altIpData = await altIpResponse.json();
            ipAddress = altIpData.IPv4 || altIpData.ip;
            console.log('Alternative IP Response:', altIpData);
          } catch (altIpError) {
            console.error('Could not fetch IP from alternative service:', altIpError);
            throw new Error('Could not detect IP address. Please check your internet connection.');
          }
        }

        if (!ipAddress) {
          throw new Error('Could not detect IP address. Please check your internet connection.');
        }

        localStorage.setItem('token', token);
        const userData = authService.getUser();
        setUser(userData);
        
        // Record login timestamp with IP address
        const loginData = {
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent,
          success: true,
          ip_address: ipAddress
        };
        console.log('GitHub Login Data:', loginData);
        localStorage.setItem('lastLogin', JSON.stringify(loginData));
        
        window.location.replace('/dashboard');
      }
    } catch (err) {
      console.error('GitHub login error:', err);
      setUser(null);
      localStorage.removeItem('token');
      throw err;
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