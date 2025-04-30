import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

const checkAuth = async () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    const response = await axios.get(`${API_URL}/check`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    localStorage.removeItem('token'); // Clear invalid token
    return false;
  }
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
    throw new Error('Network error. Please try again later.');
  }
};

const signup = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/signUp`, userData);
    // Note: The backend returns a success message rather than a token for signup
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Network error. Please try again later.');
  }
};

const logout = async () => {
  try {
    await axios.post(`${API_URL}/logout`);
    localStorage.removeItem('token');
  } catch (error) {
    localStorage.removeItem('token'); // Always remove token even if API call fails
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
  checkAuth,
  login,
  signup,
  logout,
};

export default authService;
