import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useSearchParams, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import PasswordRecovery from './components/Auth/PasswordRecovery';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './components/Home';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// OAuth callback handler component
const GitHubCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      const handleCallback = async () => {
        try {
          await window.authContext.handleOAuthCallback(token);
        } catch (error) {
          console.error('OAuth callback error:', error);
          navigate('/login');
        }
      };
      handleCallback();
    } else {
      navigate('/login');
    }
  }, [token, navigate]);

  return <LoadingSpinner size="large" text="Completing authentication..." />;
};

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <Suspense fallback={<LoadingSpinner size="large" />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/password-recovery" element={<PasswordRecovery />} />
              <Route path="/auth/github/callback" element={<GitHubCallback />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
          <ToastContainer
            position="top-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            toastClassName="app-toast"
          />
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;