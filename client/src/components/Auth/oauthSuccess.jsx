// OauthSuccess.jsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const OauthSuccess = () => {
  const { githubLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      githubLogin(token); // Save the token, update auth state
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, [location.search, githubLogin, navigate]);

  return null; // or a loading spinner
};

export default OauthSuccess;
