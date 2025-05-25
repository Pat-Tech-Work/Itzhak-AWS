// SurveyService.jsx

export const createSurvey = async (surveyData) => {
  const response = await fetch("https://itzhak-aws-vkmdh.ondigitalocean.app/itzhak-aws-server/api/survey", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(surveyData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    const error = new Error(`HTTP error! status: ${response.status}`);
    error.response = { data: errorData };
    throw error;
  }

  return await response.json();
};
// 25/5/2025
export const fetchSurveys = async () => {
  const response = await axios.get('http://localhost:4000/api/survey', {
    withCredentials: true
  });
  return response.data;
};

// בודק אם מספר הזמנה קיים // 25/5/2025
export const checkOrderNumber = async (orderNumber) => {
  const response = await fetch(`http://localhost:4000/api/orderNumber/${orderNumber}`);
  return response;
};

// בודק אם הסקר קיים לפי מספר הזמנה // 25/5/2025
export const checkSurveyExists = async (orderNumber) => {
  const response = await fetch(`http://localhost:4000/api/survey/check/${orderNumber}`);
  return await response.json();
};

// מאמת טלפון עם מספר ההזמנה // 25/5/2025
export const verifyPhoneNumber = async (orderNumber, fullPhone) => {
  const response = await fetch(`http://localhost:4000/api/survey/verify/${orderNumber}/${fullPhone}`);
  const data = await response.json();
  return { status: response.status, data };
};

// SurveyService.jsx // 25/5/2025
import axios from 'axios';

export const loginDashboard = async (email, password) => {
  try {
    const response = await axios.post('http://localhost:4000/api/login', {
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

// מאמת אם המשתמש מחובר // 25/5/2025
export const verifyToken = async () => {
  const response = await axios.get('http://localhost:4000/api/verify-token', {
    withCredentials: true
  });
  return response.data;
};
