import axios from 'axios';
import { decryptData } from '../utils/cryptoUtils'; 

const baseURL = `${import.meta.env.VITE_API_URL}/api`;
const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

// CSRF token management
let csrfToken = null;
const getCsrfToken = async () => {
  if (!csrfToken) {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/csrf-token`, {
        withCredentials: true
      });
      csrfToken = response.data.csrfToken;
    } catch (error) {
      console.warn('Failed to get CSRF token:', error);
    }
  }
  return csrfToken;
};

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    try {
      const encryptedToken = localStorage.getItem('token');
      
      if (encryptedToken) {
        const decrypted = decryptData(encryptedToken, SECRET_KEY);
        
        let token;
        if (typeof decrypted === 'string') {
          token = decrypted;
        } else if (decrypted && typeof decrypted === 'object' && decrypted.token) {
          token = decrypted.token;
        } else {
          token = decrypted;
        }
        
        if (token && typeof token === 'string') {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      
      // Add CSRF token for protected methods (skip for login/register)
      const isAuthEndpoint = config.url?.includes('/login') || config.url?.includes('/register');
      if (['post', 'put', 'patch', 'delete'].includes(config.method) && !config.headers['x-csrf-token'] && !isAuthEndpoint) {
        try {
          const csrf = await getCsrfToken();
          if (csrf) {
            config.headers['x-csrf-token'] = csrf;
          }
        } catch (error) {
          console.warn('Failed to get CSRF token:', error);
        }
      }
    } catch (error) {
      console.error('❌ Failed to decrypt token:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      csrfToken = null; // Reset CSRF token on auth failure
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export { getCsrfToken };
export default api;
