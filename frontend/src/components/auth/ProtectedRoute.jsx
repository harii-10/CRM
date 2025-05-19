import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../layout/DashboardLayout';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const token = localStorage.getItem('token');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Check if there's a token in localStorage, even if the auth context hasn't loaded yet
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
