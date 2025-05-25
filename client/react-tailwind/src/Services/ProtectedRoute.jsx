// ProtectedRoute.jsx // 25/5/2025
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { verifyToken } from './SurveyService'; // או AuthService אם פיצלת

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verify = async () => {
      try {
        await verifyToken();
        setIsAuthenticated(true);
      } catch (err) {
        setIsAuthenticated(false);
      }
    };
    verify();
  }, []);

  if (isAuthenticated === null) return <div>Loading...</div>;
  if (isAuthenticated === false) return <Navigate to="/login" />;
  return children;
};

export default ProtectedRoute;
