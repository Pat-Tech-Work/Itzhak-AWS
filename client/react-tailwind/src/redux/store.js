// src/redux/store.js
//  הקובץ שמרכז את כל ה-slices
// הו ה-"מוח הראשי" של Redux, וכל קומפוננטה באפליקציה יכולה להתחבר אליו דרך ה־Provider
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import surveyReducer from './slices/surveySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    survey: surveyReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // התעלם מ-actions שאינן serializable אם יש
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});