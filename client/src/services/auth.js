import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

const decodeToken = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (error) {
    return null;
  }
};

const getUser = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  const decoded = decodeToken(token);
  if (!decoded) {
    localStorage.removeItem('token');
    return null;
  }
  
  // Check if token is expired
  if (decoded.exp && decoded.exp * 1000 < Date.now()) {
    localStorage.removeItem('token');
    return null;
  }
  
  return decoded;
};

const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    }
    throw error; 
  }
};

const signup = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/signUp`, userData);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    }
    throw error; 
  }
};

const logout = async () => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      await axios.post(`${API_URL}/logout`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    
    // Clear all auth-related data
    localStorage.removeItem('token');
    localStorage.removeItem('lastLogin');
    localStorage.removeItem('failedLogins');
    
    // Clear browser history and prevent back navigation
    window.history.pushState(null, '', '/login');
    
    // Force a hard redirect to login page
    window.location.href = '/login';
    
    // Additional security measure: prevent any further navigation
    window.onpopstate = function() {
      window.history.pushState(null, '', '/login');
      window.location.href = '/login';
    };
  } catch (error) {
    console.error('Logout error:', error);
    // Even if the API call fails, clear everything and redirect
    localStorage.removeItem('token');
    localStorage.removeItem('lastLogin');
    localStorage.removeItem('failedLogins');
    window.history.pushState(null, '', '/login');
    window.location.href = '/login';
  }
};

// Add axios interceptor to include token in all requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const authService = {
  getUser,
  login,
  signup,
  logout,
};

export default authService;