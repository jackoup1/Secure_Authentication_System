// OAuthSuccess.jsx
import React, { useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import LoadingSpinner from '../LoadingSpinner';

const OAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const { githubLogin } = useContext(AuthContext);

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      githubLogin(token);
    }
  }, [searchParams, githubLogin]);

  return <LoadingSpinner />;
};

export default OAuthSuccess;
