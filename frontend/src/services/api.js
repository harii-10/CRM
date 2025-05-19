import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
  updateProfile: async (userData) => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },
};

// Customer services
export const customerService = {
  getCustomers: async () => {
    const response = await api.get('/customers');
    return response.data;
  },
  getCustomer: async (id) => {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  },
  createCustomer: async (customerData) => {
    const response = await api.post('/customers', customerData);
    return response.data;
  },
  updateCustomer: async (id, customerData) => {
    const response = await api.put(`/customers/${id}`, customerData);
    return response.data;
  },
  deleteCustomer: async (id) => {
    const response = await api.delete(`/customers/${id}`);
    return response.data;
  },
  addInteraction: async (id, interactionData) => {
    const response = await api.post(`/customers/${id}/interactions`, interactionData);
    return response.data;
  },
};

// Lead services
export const leadService = {
  getLeads: async (filters = {}) => {
    const response = await api.get('/leads', { params: filters });
    return response.data;
  },
  getLead: async (id) => {
    const response = await api.get(`/leads/${id}`);
    return response.data;
  },
  createLead: async (leadData) => {
    const response = await api.post('/leads', leadData);
    return response.data;
  },
  updateLead: async (id, leadData) => {
    const response = await api.put(`/leads/${id}`, leadData);
    return response.data;
  },
  deleteLead: async (id) => {
    const response = await api.delete(`/leads/${id}`);
    return response.data;
  },
};

// Task services
export const taskService = {
  getTasks: async (filters = {}) => {
    const response = await api.get('/tasks', { params: filters });
    return response.data;
  },
  getTask: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },
  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },
  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },
  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
};

// Dashboard services
export const dashboardService = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
  getLeadPerformance: async () => {
    const response = await api.get('/dashboard/lead-performance');
    return response.data;
  },
};

export default api;
