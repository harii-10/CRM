import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../layout/DashboardLayout';

const ProtectedRoute = () => {
  const { isAuthenticated, loading, logout } = useAuth();
  const token = localStorage.getItem('token');
  const lastActivity = localStorage.getItem('lastActivity');
  const SESSION_TIMEOUT = 10 * 60 * 1000; // 10 minutes in milliseconds

  // Check for session timeout
  useEffect(() => {
    const checkSessionTimeout = () => {
      const storedLastActivity = localStorage.getItem('lastActivity');

      if (storedLastActivity) {
        const timeSinceLastActivity = Date.now() - parseInt(storedLastActivity);
        if (timeSinceLastActivity > SESSION_TIMEOUT) {
          console.log('Session timeout in ProtectedRoute - redirecting to login');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('lastActivity');
          window.location.href = '/login';
        }
      }
    };

    // Check immediately
    checkSessionTimeout();

    // Set up interval to check regularly
    const interval = setInterval(checkSessionTimeout, 60000); // Check every minute

    // Set up event listeners to update last activity
    const updateActivity = () => {
      localStorage.setItem('lastActivity', Date.now().toString());
    };

    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('click', updateActivity);
    window.addEventListener('scroll', updateActivity);

    // Initial activity timestamp
    updateActivity();

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('click', updateActivity);
      window.removeEventListener('scroll', updateActivity);
    };
  }, [SESSION_TIMEOUT]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated && !token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default ProtectedRoute;
