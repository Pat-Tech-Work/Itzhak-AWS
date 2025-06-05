// src/api/axiosInstance.js
import axios from 'axios';

// ודאי שמשתנה הסביבה VITE_API_BASE_URL מוגדר בקובץ .env שלך כך:
// VITE_API_BASE_URL=https://itzhak-aws-vkmdh.ondigitalocean.app/itzhak-aws-server/api
const baseURL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true, // חשוב לאימות מבוסס cookies
});

export default axiosInstance;