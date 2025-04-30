import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { FaUser, FaEnvelope, FaLock, FaShieldAlt, FaExclamationCircle, FaCheckCircle, FaTimes } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Signup = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const validationSchemas = {
    1: Yup.object({
      username: Yup.string()
        .min(3, 'Username must be at least 3 characters')
        .required('Username is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required')
    }),
    2: Yup.object({
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .matches(/[!@#$%^&*]/, 'Password must contain at least one special character (!@#$%^&*)')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Please confirm your password'),
      acceptTerms: Yup.boolean()
        .oneOf([true], 'You must accept the terms and conditions')
    })
  };

  const renderPasswordStrength = (password) => {
    const requirements = [
      { regex: /.{8,}/, text: 'At least 8 characters' },
      { regex: /[A-Z]/, text: 'One uppercase letter' },
      { regex: /[a-z]/, text: 'One lowercase letter' },
      { regex: /[0-9]/, text: 'One number' },
      { regex: /[!@#$%^&*]/, text: 'One special character' }
    ];

    return (
      <motion.div 
        className="password-requirements"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h4>Password Requirements:</h4>
        <div className="requirements-grid">
          {requirements.map((requirement, index) => (
            <motion.div
              key={index}
              className={`requirement-item ${requirement.regex.test(password) ? 'valid' : ''}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {requirement.regex.test(password) ? (
                <FaCheckCircle className="requirement-icon success" />
              ) : (
                <FaTimes className="requirement-icon" />
              )}
              <span>{requirement.text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div 
      className="auth-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="auth-header">
        <h2>Create Account</h2>
        <p className="step-indicator">
          Step {step} of 2: {step === 1 ? 'Basic Information' : 'Security Setup'}
        </p>
      </div>

      <motion.div 
        className="progress-bar-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="progress-steps">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>1</div>
          <div className="progress-line" />
          <div className={`step ${step >= 2 ? 'active' : ''}`}>2</div>
        </div>
      </motion.div>

      <Formik
        initialValues={{
          username: formData.username,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          acceptTerms: formData.acceptTerms
        }}
        validationSchema={validationSchemas[step]}
        onSubmit={async (values, actions) => {
          try {
            if (step === 1) {
              setFormData(prev => ({
                ...prev,
                username: values.username,
                email: values.email
              }));
              setStep(2);
            } else {
              const userData = {
                username: formData.username,
                email: formData.email,
                password: values.password
              };
              
              const response = await signup(userData);
              toast.success(response.message || 'Account created successfully!', {
                icon: <FaCheckCircle />
              });
              
              // After successful signup, navigate to login
              navigate('/login', { 
                state: { 
                  email: formData.email,
                  message: 'Account created successfully! Please login to continue.' 
                }
              });
            }
          } catch (err) {
            const errorMessage = err.message || 'Signup failed';
            actions.setErrors({ submit: errorMessage });
            toast.error(errorMessage, {
              icon: <FaExclamationCircle />
            });
          } finally {
            actions.setSubmitting(false);
          }
        }}
        enableReinitialize={true}
      >
        {({ errors, touched, isSubmitting, values, setFieldValue }) => (
          <Form className="auth-form">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <>
                  <motion.div 
                    className="form-group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <label>
                      <FaUser className="field-icon" /> Username
                    </label>
                    <Field
                      type="text"
                      name="username"
                      className={`form-input ${touched.username && errors.username ? 'error' : ''}`}
                      placeholder="Choose a username"
                    />
                    {touched.username && errors.username && (
                      <div className="error-message">
                        <FaExclamationCircle /> {errors.username}
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
                      <FaEnvelope className="field-icon" /> Email
                    </label>
                    <Field
                      type="email"
                      name="email"
                      className={`form-input ${touched.email && errors.email ? 'error' : ''}`}
                      placeholder="Enter your email"
                    />
                    {touched.email && errors.email && (
                      <div className="error-message">
                        <FaExclamationCircle /> {errors.email}
                      </div>
                    )}
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div 
                    className="form-group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <label>
                      <FaLock className="field-icon" /> Password
                    </label>
                    <Field
                      type="password"
                      name="password"
                      className={`form-input ${touched.password && errors.password ? 'error' : ''}`}
                      placeholder="Create a strong password"
                    />
                    {renderPasswordStrength(values.password)}
                    {touched.password && errors.password && (
                      <div className="error-message">
                        <FaExclamationCircle /> {errors.password}
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
                      <FaShieldAlt className="field-icon" /> Confirm Password
                    </label>
                    <Field
                      type="password"
                      name="confirmPassword"
                      className={`form-input ${touched.confirmPassword && errors.confirmPassword ? 'error' : ''}`}
                      placeholder="Confirm your password"
                    />
                    {touched.confirmPassword && errors.confirmPassword && (
                      <div className="error-message">
                        <FaExclamationCircle /> {errors.confirmPassword}
                      </div>
                    )}
                  </motion.div>

                  <motion.div 
                    className="form-group terms-group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="checkbox-label">
                      <Field
                        type="checkbox"
                        name="acceptTerms"
                        checked={values.acceptTerms}
                        onChange={(e) => {
                          setFieldValue('acceptTerms', e.target.checked);
                        }}
                      />
                      <span>I accept the terms and conditions</span>
                    </label>
                    {touched.acceptTerms && errors.acceptTerms && (
                      <div className="error-message">
                        <FaExclamationCircle /> {errors.acceptTerms}
                      </div>
                    )}
                  </motion.div>
                </>
              )}

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

              <div className="form-actions">
                {step === 2 && (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn btn-outline"
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="loading"></span>
                  ) : step === 1 ? (
                    'Next'
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>
            </AnimatePresence>
          </Form>
        )}
      </Formik>

      <div className="auth-footer">
        Already have an account? <Link to="/login" className="link-primary">Login</Link>
      </div>
    </motion.div>
  );
};

export default Signup;