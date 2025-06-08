// src/api/axiosInstance.js
import axios from 'axios';

// ודאי ש־VITE_API_BASE_URL מוגדר בקובץ .env שלך
const baseURL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

// Interceptor להוספת הטוקן מה-localStorage לכל בקשה
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
