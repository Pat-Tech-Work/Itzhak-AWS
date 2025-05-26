// ProtectedRoute.jsx // 26/5/2025
// ProtectedRoute.jsx - עדכון מתוקן
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { verifyToken } from './SurveyService';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      try {
        await verifyToken();
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Token verification failed:', err);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
