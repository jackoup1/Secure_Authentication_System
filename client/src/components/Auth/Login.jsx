import React, { useContext, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { FaGithub, FaEnvelope, FaLock, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required'),
  rememberMe: Yup.boolean()
});

const Login = () => {
  const { login, githubLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Show success message if redirected from signup
    if (location.state?.message) {
      toast.success(location.state.message, {
        icon: <FaCheckCircle />
      });
    }

    // Check for saved credentials or email from signup
    const emailToUse = location.state?.email || localStorage.getItem('rememberedEmail');
    if (emailToUse) {
      document.getElementById('email').value = emailToUse;
      if (localStorage.getItem('rememberedEmail')) {
        document.getElementById('rememberMe').checked = true;
      }
    }
  }, [location.state]);

  const handleGithubLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/github';
  };
  

  const handleLoginSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      await login(values);

      // Handle "Remember Me" functionality
      if (values.rememberMe) {
        localStorage.setItem('rememberedEmail', values.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      // Log login activity
      const loginData = {
        timestamp: new Date().toISOString(),
        ip_address: await fetch('https://api.ipify.org?format=json').then(r => r.json()).then(data => data.ip),
        user_agent: navigator.userAgent,
        success: true
      };
      localStorage.setItem('lastLogin', JSON.stringify(loginData));

      toast.success('Login successful', {
        icon: <FaCheckCircle />
      });
      navigate(location.state?.from || '/dashboard');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setErrors({ submit: errorMessage });
      toast.error(errorMessage, {
        icon: <FaExclamationCircle />
      });

      // Log failed attempt
      const failedLoginData = {
        timestamp: new Date().toISOString(),
        error: errorMessage,
        success: false
      };
      const failedAttempts = JSON.parse(localStorage.getItem('failedLogins') || '[]');
      failedAttempts.push(failedLoginData);
      localStorage.setItem('failedLogins', JSON.stringify(failedAttempts));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      className="auth-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="auth-header">
        <h2>Welcome Back</h2>
        <p>Sign in to continue to your account</p>
      </div>

      <Formik
        initialValues={{
          email: localStorage.getItem('rememberedEmail') || '',
          password: '',
          rememberMe: Boolean(localStorage.getItem('rememberedEmail'))
        }}
        validationSchema={loginSchema}
        onSubmit={handleLoginSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="auth-form">
            <motion.div
              className="form-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <label>
                <FaEnvelope className="field-icon" /> Email
              </label>
              <Field
                type="email"
                name="email"
                id="email"
                className={`form-input ${touched.email && errors.email ? 'error' : ''}`}
                placeholder="Enter your email"
              />
              {touched.email && errors.email && (
                <div className="error-message">
                  <FaExclamationCircle /> {errors.email}
                </div>
              )}
            </motion.div>

            <motion.div
              className="form-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label>
                <FaLock className="field-icon" /> Password
              </label>
              <Field
                type="password"
                name="password"
                id="password"
                className={`form-input ${touched.password && errors.password ? 'error' : ''}`}
                placeholder="Enter your password"
              />
              {touched.password && errors.password && (
                <div className="error-message">
                  <FaExclamationCircle /> {errors.password}
                </div>
              )}
            </motion.div>

            <div className="form-group form-actions">
              <label className="checkbox-label">
                <Field type="checkbox" name="rememberMe" id="rememberMe" />
                <span>Keep me signed in</span>
              </label>
              <Link
                to="/password-recovery"
                className="btn-link"
              >
                Forgot password?
              </Link>
            </div>

            {errors.submit && (
              <motion.div
                className="alert alert-error"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <FaExclamationCircle className="alert-icon" />
                <div className="alert-content">{errors.submit}</div>
              </motion.div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="loading"></span>
              ) : (
                'Sign In'
              )}
            </button>
          </Form>
        )}
      </Formik>

      <div className="divider">
        <span>OR</span>
      </div>

      <button
        onClick={handleGithubLogin}
        className="btn btn-github w-full"
      >
        <FaGithub /> Continue with GitHub
      </button>

      <div className="auth-footer">
        <p>
          Don't have an account? <Link to="/signup" className="link-primary">Sign up</Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Login;