import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  const spinnerSizes = {
    small: '1.5rem',
    medium: '2rem',
    large: '3rem'
  };

  return (
    <div className="loading-container" role="alert" aria-busy="true">
      <motion.div
        className="loading"
        style={{ width: spinnerSizes[size], height: spinnerSizes[size] }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;