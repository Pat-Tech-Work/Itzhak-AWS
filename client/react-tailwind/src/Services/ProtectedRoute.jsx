import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { verifyTokenThunk } from '../redux/slices/authSlice';

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const {
    isAuthenticated,
    isLoading,
    isTokenVerificationAttempted,
  } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isTokenVerificationAttempted) {
      dispatch(verifyTokenThunk());
    }
  }, [dispatch, isTokenVerificationAttempted]);

  if (isLoading || !isTokenVerificationAttempted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">מאמת הרשאה...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
