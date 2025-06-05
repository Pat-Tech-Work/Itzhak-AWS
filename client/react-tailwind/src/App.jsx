
import { Routes, Route } from "react-router-dom"; // Only import Routes and Route now
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyTokenThunk } from './redux/slices/authSlice'; // Thunk לאימות טוקן

import Step_1 from "./Pages/Step_1";
import Step_2 from "./Pages/Step_2";
import Step_3 from "./Pages/Step_3";
import Step_4 from "./Pages/Step_4";
import SuccessPage from "./Pages/SuccessPage";
import CouponUpload from "./Services/CouponUpload";
import Dashboard from "./Pages/Dashboard";
import Login from "./Services/Login";
import ProtectedRoute from "./Services/ProtectedRoute";

function App() {
  const dispatch = useDispatch();
  const { isTokenVerificationAttempted } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isTokenVerificationAttempted) {
      dispatch(verifyTokenThunk());
    }
  }, [dispatch, isTokenVerificationAttempted]);

  return (
    <Routes>
      <Route path="/" element={<Step_1 />} />
      <Route path="/step_1" element={<Step_1 />} />
      <Route path="/step_2" element={<Step_2 />} />
      <Route path="/step_3" element={<Step_3 />} />
      <Route path="/step_4" element={<Step_4 />} />
      <Route path="/success" element={<SuccessPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route path="/upload-coupons" element={
        <ProtectedRoute>
          <CouponUpload />
        </ProtectedRoute>
      } />


      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
