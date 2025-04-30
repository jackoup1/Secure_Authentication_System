import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { FaEnvelope, FaExclamationCircle, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';

const recoverySchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required')
});

const PasswordRecovery = () => {
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      // TODO: Implement actual password recovery API call
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulated API call
      setIsEmailSent(true);
      toast.success('Password recovery instructions sent to your email', {
        icon: <FaCheckCircle />
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to send recovery email';
      setErrors({ submit: errorMessage });
      toast.error(errorMessage, {
        icon: <FaExclamationCircle />
      });
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
        <h2>Password Recovery</h2>
        <p>{isEmailSent 
          ? 'Check your email for recovery instructions' 
          : 'Enter your email to reset your password'}
        </p>
      </div>

      {!isEmailSent ? (
        <Formik
          initialValues={{ email: '' }}
          validationSchema={recoverySchema}
          onSubmit={handleSubmit}
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
                  className={`form-input ${touched.email && errors.email ? 'error' : ''}`}
                  placeholder="Enter your email address"
                />
                {touched.email && errors.email && (
                  <div className="error-message">
                    <FaExclamationCircle /> {errors.email}
                  </div>
                )}
              </motion.div>

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
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="loading"></span>
                ) : (
                  'Send Recovery Link'
                )}
              </button>
            </Form>
          )}
        </Formik>
      ) : (
        <motion.div
          className="recovery-success"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="alert alert-success">
            <FaCheckCircle className="alert-icon" />
            <div className="alert-content">
              Recovery instructions have been sent to your email address. 
              Please check your inbox and follow the instructions to reset your password.
            </div>
          </div>
        </motion.div>
      )}

      <div className="auth-footer">
        <Link to="/login" className="btn btn-link">
          <FaArrowLeft /> Back to Login
        </Link>
      </div>
    </motion.div>
  );
};

export default PasswordRecovery;