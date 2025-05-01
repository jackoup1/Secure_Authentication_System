import React, { useContext, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    // Clear any existing history and prevent back navigation
    window.history.pushState(null, '', window.location.href);
    
    const handlePopState = (e) => {
      // Prevent the default back/forward behavior
      e.preventDefault();
      
      if (!user) {
        // Force redirect to login and clear history
        window.history.pushState(null, '', '/login');
        window.location.replace('/login');
      } else {
        // If user is authenticated, allow navigation but prevent caching
        window.history.replaceState(null, '', window.location.href);
      }
    };

    // Add event listeners for both popstate and beforeunload
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', () => {
      if (!user) {
        window.history.pushState(null, '', '/login');
      }
    });

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', () => {
        if (!user) {
          window.history.pushState(null, '', '/login');
        }
      });
    };
  }, [user]);

  // If loading, show spinner
  if (loading) {
    return <LoadingSpinner />;
  }

  // If no user, redirect to login
  if (!user) {
    // Clear any existing history before redirecting
    window.history.pushState(null, '', '/login');
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export default ProtectedRoute;