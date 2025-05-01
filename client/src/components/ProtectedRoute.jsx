import React, { useContext, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    // Prevent caching of protected pages
    document.documentElement.style.setProperty('--cache-control', 'no-store');
    
    return () => {
      document.documentElement.style.removeProperty('--cache-control');
    };
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    // Save the attempted URL for redirecting after login
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export default ProtectedRoute;