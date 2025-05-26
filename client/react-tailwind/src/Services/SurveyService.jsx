// SurveyService.jsx
const baseURL = import.meta.env.VITE_API_BASE_URL;

export const createSurvey = async (surveyData) => {
  const response = await fetch(`${baseURL}/survey`, //"https://itzhak-aws-vkmdh.ondigitalocean.app/api/survey"
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(surveyData),
      credentials: "include" // 26/5/2025

    });

  if (!response.ok) {
    const errorData = await response.json();
    const error = new Error(`HTTP error! status: ${response.status}`);
    error.response = { data: errorData };
    throw error;
  }

  return await response.json();
};

// 26/5/2025
// מביא סקרים (מוגן)
export const fetchSurveys = async () => {
  try {
    const response = await axios.get(`${baseURL}/survey`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Unauthorized - Please login");
    }
    throw new Error("Failed to fetch surveys");
  }
};


// בודק אם מספר הזמנה קיים // 25/5/2025
export const checkOrderNumber = async (orderNumber) => {
  const response = await fetch(`${baseURL}/orderNumber/${orderNumber}`);
  return response;
};

// בודק אם הסקר קיים לפי מספר הזמנה // 25/5/2025
export const checkSurveyExists = async (orderNumber) => {
  const response = await fetch(`${baseURL}/survey/check/${orderNumber}`);
  return await response.json();
};

// מאמת טלפון עם מספר ההזמנה // 25/5/2025
export const verifyPhoneNumber = async (orderNumber, fullPhone) => {
  const response = await fetch(`${baseURL}/survey/verify/${orderNumber}/${fullPhone}`);
  const data = await response.json();
  return { status: response.status, data };
};

// SurveyService.jsx // 25/5/2025
import axios from 'axios';
// הגדרת axios עם עוגיות
axios.defaults.withCredentials = true; // 26/5/2025


// 26/5/2025
export const loginDashboard = async (email, password) => {
  try {
    const response = await axios.post(`${baseURL}/login`, {
      email,
      password
    }, {
      withCredentials: true // שולח/מקבל עוגיות
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};

// מאמת אם המשתמש מחובר // 26/5/2025
// מאמת טוקן
export const verifyToken = async () => {
  try {
    const response = await axios.get(`${baseURL}/login/verify-token`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw new Error("Token verification failed");
  }
};

// 26/5/2025
// התנתקות
export const logout = async () => {
  try {
    await axios.post(`${baseURL}/login/logout`, {}, {
      withCredentials: true
    });
  } catch (error) {
    console.error('Logout error:', error);
  }
};
// 26/5/2025
// העלאת קובץ קופונים
export const uploadCouponFile = async (file) => {
  const formData = new FormData();
  formData.append('couponFile', file);

  try {
    const response = await fetch(`${baseURL}/couponCode/upload`, {
      method: 'POST',
      body: formData,
      credentials: "include"
    });

    const result = await response.json();

    if (!response.ok) {
      const error = new Error(result.error || "Upload failed");
      error.response = result;
      throw error;
    }

    return result;
  } catch (err) {
    throw new Error("Server error. Try again later.");
  }
};
