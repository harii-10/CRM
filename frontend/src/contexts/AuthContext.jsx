import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const SESSION_TIMEOUT = 10 * 60 * 1000; // 10 minutes in milliseconds

  // Update last activity timestamp on user interaction
  useEffect(() => {
    const updateActivity = () => {
      setLastActivity(Date.now());
      localStorage.setItem('lastActivity', Date.now().toString());
    };

    // Add event listeners for user activity
    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('click', updateActivity);
    window.addEventListener('scroll', updateActivity);

    return () => {
      // Clean up event listeners
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('click', updateActivity);
      window.removeEventListener('scroll', updateActivity);
    };
  }, []);

  // Check for session timeout
  useEffect(() => {
    const checkSessionTimeout = () => {
      const storedLastActivity = localStorage.getItem('lastActivity');

      if (storedLastActivity && user) {
        const timeSinceLastActivity = Date.now() - parseInt(storedLastActivity);

        if (timeSinceLastActivity > SESSION_TIMEOUT) {
          console.log('Session timeout - logging out');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('lastActivity');
          setUser(null);
          window.location.href = '/login';
        }
      }
    };

    const interval = setInterval(checkSessionTimeout, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      const storedLastActivity = localStorage.getItem('lastActivity');

      if (token && storedUser) {
        // Check for session timeout
        if (storedLastActivity) {
          const timeSinceLastActivity = Date.now() - parseInt(storedLastActivity);
          if (timeSinceLastActivity > SESSION_TIMEOUT) {
            console.log('Session timeout during initialization - logging out');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('lastActivity');
            setLoading(false);
            return;
          }
        }

        try {
          setUser(JSON.parse(storedUser));
          // Verify token is valid by fetching profile
          const profile = await authService.getProfile();
          setUser(profile);
          // Update last activity
          setLastActivity(Date.now());
          localStorage.setItem('lastActivity', Date.now().toString());
        } catch (err) {
          console.error('Failed to validate token:', err);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('lastActivity');
          setUser(null);
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setError(null);
      const data = await authService.login(credentials);

      // Store auth data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('lastActivity', Date.now().toString());

      setUser(data.user);
      setLastActivity(Date.now());

      return data.user;
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      console.log('Registering user with data:', userData);
      setError(null);

      const result = await authService.register(userData);
      console.log('Registration result:', result);

      // After registration, log the user in
      console.log('Attempting to login after registration');
      return await login({
        email: userData.email,
        password: userData.password,
      });
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.error || 'Registration failed');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('lastActivity');
    setUser(null);
    setLastActivity(0);
    // Redirect to login page
    window.location.href = '/login';
  };

  const updateProfile = async (userData) => {
    try {
      setError(null);
      const updatedUser = await authService.updateProfile(userData);
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
