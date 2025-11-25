import axios from 'axios';
import { decryptData } from '../utils/cryptoUtils'; 

const baseURL = import.meta.env.VITE_API_URL;
const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
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
        
        console.log('🔓 Decrypted token:', token);
        
        if (token && typeof token === 'string') {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
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
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
