import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiHome,
  FiUsers,
  FiTrendingUp,
  FiCheckSquare,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiUser
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Get user from localStorage as a fallback
  const storedUserString = localStorage.getItem('user');
  const storedUser = storedUserString ? JSON.parse(storedUserString) : null;
  const currentUser = user || storedUser;

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: FiHome },
    { name: 'Customers', href: '/customers', icon: FiUsers },
    { name: 'Leads', href: '/leads', icon: FiTrendingUp },
    { name: 'Tasks', href: '/tasks', icon: FiCheckSquare },
    { name: 'Settings', href: '/settings', icon: FiSettings },
  ];

  const handleLogout = () => {
    // Direct logout approach
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for mobile */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={toggleSidebar}></div>
        <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-primary-800 text-white">
          <div className="flex items-center justify-between h-16 px-4 border-b border-primary-700">
            <h1 className="text-xl font-bold">CRM System</h1>
            <button onClick={toggleSidebar} className="text-white">
              <FiX size={24} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <nav className="px-2 py-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-2 text-sm rounded-md ${
                    location.pathname === item.href
                      ? 'bg-primary-700 text-white'
                      : 'text-primary-100 hover:bg-primary-700'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="p-4 border-t border-primary-700">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-primary-100 rounded-md hover:bg-primary-700"
            >
              <FiLogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:bg-primary-800 lg:text-white">
        <div className="flex items-center h-16 px-4 border-b border-primary-700">
          <h1 className="text-xl font-bold">CRM System</h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          <nav className="px-2 py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-2 text-sm rounded-md ${
                  location.pathname === item.href
                    ? 'bg-primary-700 text-white'
                    : 'text-primary-100 hover:bg-primary-700'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-primary-700">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-primary-100 rounded-md hover:bg-primary-700"
          >
            <FiLogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navigation */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={toggleSidebar}
              className="text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 lg:hidden"
            >
              <FiMenu size={24} />
            </button>
            <div className="flex items-center">
              <div className="relative">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary-600 rounded-full">
                    <FiUser className="text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {currentUser?.name || 'User'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
