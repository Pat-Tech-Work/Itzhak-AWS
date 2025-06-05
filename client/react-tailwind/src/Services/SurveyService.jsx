// SurveyService.jsx
/*
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.baseURL = baseURL;
axios.defaults.withCredentials = true;

// יצירת סקר חדש
export const createSurvey = async (surveyData) => {
  try {
    const response = await axios.post('/survey', surveyData, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || `שגיאת HTTP! סטטוס: ${error.response?.status}`;
    throw new Error(errorMessage);
  }
};

// הבאת סקרים (מוגן)
export const fetchSurveys = async () => {
  try {
    const response = await axios.get('/survey');
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('לא מורשה - אנא התחבר');
    }
    throw new Error('נכשל בהבאת סקרים');
  }
};

// בדיקת קיום סקר לפי מספר הזמנה
export const checkSurveyExists = async (orderNumber) => {
  try {
    const response = await axios.get(`/survey/check/${orderNumber}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// אימות מספר טלפון עם מספר הזמנה
export const verifyPhoneNumber = async (orderNumber, fullPhone) => {
  try {
    const response = await axios.get(`/survey/verify/${orderNumber}/${fullPhone}`);
    return { status: response.status, data: response.data };
  } catch (error) {
    throw error;
  }
};

// בדיקת מספר הזמנה
export const checkOrderNumber = async (orderNumber) => {
  try {
    const response = await axios.get(`/orderNumber/${orderNumber}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// התחברות לדשבורד
export const loginDashboard = async (email, password) => {
  try {
    const response = await axios.post('/login', { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'שגיאה בהתחברות');
  }
};

// אימות טוקן
export const verifyToken = async () => {
  try {
    await axios.get('/dashboard');
    return true;
  } catch (error) {
    throw new Error('אימות נכשל');
  }
};

// העלאת קובץ קופונים
export const uploadCouponFile = async (file) => {
  const formData = new FormData();
  formData.append('couponFile', file);

  try {
    const response = await axios.post('/couponCode/upload', formData);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'העלאה נכשלה';
    throw new Error(errorMessage);
  }
};

export const handleLogout = async () => {
  try {
    await axios.post('/login/logout');
    window.location.href = '/login';
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

*/