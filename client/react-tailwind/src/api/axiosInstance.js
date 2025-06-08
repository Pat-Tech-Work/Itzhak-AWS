// src/api/axiosInstance.js
import axios from 'axios';

// ודאי שמשתנה הסביבה VITE_API_BASE_URL מוגדר בקובץ .env שלך כך:
// VITE_API_BASE_URL=https://itzhak-aws-vkmdh.ondigitalocean.app/itzhak-aws-server/api
const baseURL = import.meta.env.VITE_API_BASE_URL;

// הכנסי את הטוקן בכל בקשה
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;
