// src/redux/slices/surveySlice.js
// המודול שאחראי על  הניהול מצב של הסקרים
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

// Thunk ליצירת סקר חדש
export const createSurveyThunk = createAsyncThunk(
  'survey/createSurvey',
  async (surveyData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/survey', surveyData, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || `HTTP Error! Status: ${error.response?.status}`;
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk להבאת כל הסקרים
// פקודה שמריצה פעולה אסינכרונית (כמו fetchSurveys) ומחזירה תוצאה אוטומטית ל-Redux

export const fetchSurveysThunk = createAsyncThunk(
  'survey/fetchSurveys', // הפעולה שמביאה את הנתונים מהשרת
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/survey');
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue('Unauthorized - please log in');
      }
      return rejectWithValue('Failed to fetch surveys');
    }
  }
);

// Thunk לבדיקת קיום סקר לפי מספר הזמנה
export const checkSurveyExistsThunk = createAsyncThunk(
  'survey/checkSurveyExists',
  async (orderNumber, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/survey/check/${orderNumber}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || `Error checking survey for order ${orderNumber}`;
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk לאימות מספר טלפון עם מספר הזמנה
export const verifyPhoneNumberThunk = createAsyncThunk(
  'survey/verifyPhoneNumber',
  async ({ orderNumber, fullPhone }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/survey/verify/${orderNumber}/${fullPhone}`);
      return { status: response.status, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || `Error verifying phone number`;
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk לבדוק אם מספר הזמנה קיים
export const checkOrderNumberThunk = createAsyncThunk(
  'survey/checkOrderNumber',
  async (orderNumber, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/orderNumber/${orderNumber}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return rejectWithValue(error.response?.data?.error || `Order number ${orderNumber} not in the system.`);
      }
      const errorMessage = error.response?.data?.message || `Error checking order number ${orderNumber}`;
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk להעלאת קובץ קופונים
export const uploadCouponFileThunk = createAsyncThunk(
  'survey/uploadCouponFile',
  async (file, { rejectWithValue }) => {
    const formData = new FormData();
    formData.append('couponFile', file);
    try {
      const response = await axiosInstance.post('/couponCode/upload', formData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Upload failed';
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
  surveys: [],
  currentSurveyData: null,
  orderNumberCheckStatus: { checked: false, isValid: false, data: null, error: null },
  surveyExistsStatus: { checked: false, exists: false, data: null, error: null },
  phoneNumberVerificationStatus: { checked: false, status: null, data: null, error: null },
  couponUploadStatus: 'idle',
  isLoading: false,
  error: null,
};

// אובייקט שמכיל את ה-state (surveys, loading, error) ואת הפעולות שמשנות אותו
const surveySlice = createSlice({
  name: 'survey',
  initialState,
  reducers: {
    clearSurveyError: (state) => {
      state.error = null;
      state.orderNumberCheckStatus.error = null;
      state.surveyExistsStatus.error = null;
      state.phoneNumberVerificationStatus.error = null;
    },
    resetSurveyState: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Survey
      .addCase(createSurveyThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createSurveyThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSurveyData = action.payload;
      })
      .addCase(createSurveyThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch Surveys
      .addCase(fetchSurveysThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSurveysThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.surveys = action.payload;
      })
      .addCase(fetchSurveysThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Check Order Number
      .addCase(checkOrderNumberThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.orderNumberCheckStatus = { checked: false, isValid: false, data: null, error: null };
      })
      .addCase(checkOrderNumberThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderNumberCheckStatus = { checked: true, isValid: true, data: action.payload, error: null };
      })
      .addCase(checkOrderNumberThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.orderNumberCheckStatus = { checked: true, isValid: false, data: null, error: action.payload };
        state.error = action.payload;
      })

      // Check Survey Exists
      .addCase(checkSurveyExistsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.surveyExistsStatus = { checked: false, exists: false, data: null, error: null };
      })
      .addCase(checkSurveyExistsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.surveyExistsStatus = { checked: true, exists: !!action.payload.exists, data: action.payload, error: null };
      })
      .addCase(checkSurveyExistsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.surveyExistsStatus = { checked: true, exists: false, data: null, error: action.payload };
        state.error = action.payload;
      })

      // Verify Phone Number
      .addCase(verifyPhoneNumberThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.phoneNumberVerificationStatus = { checked: false, status: null, data: null, error: null };
      })
      .addCase(verifyPhoneNumberThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.phoneNumberVerificationStatus = {
          checked: true,
          status: action.payload.status,
          data: action.payload.data,
          error: null,
        };
      })
      .addCase(verifyPhoneNumberThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.phoneNumberVerificationStatus = {
          checked: true,
          status: action.error?.message?.includes("401") ? 401 : (action.error?.message?.includes("404") ? 404 : 'error'),
          data: null,
          error: action.payload,
        };
        state.error = action.payload;
      })

      // Upload Coupon File
      .addCase(uploadCouponFileThunk.pending, (state) => {
        state.couponUploadStatus = 'loading';
        state.error = null;
      })
      .addCase(uploadCouponFileThunk.fulfilled, (state) => {
        state.couponUploadStatus = 'succeeded';
      })
      .addCase(uploadCouponFileThunk.rejected, (state, action) => {
        state.couponUploadStatus = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearSurveyError, resetSurveyState } = surveySlice.actions;
export default surveySlice.reducer;