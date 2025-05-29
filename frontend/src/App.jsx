import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './App.css';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Dashboard Pages
import Dashboard from './pages/Dashboard';
import CustomersPage from './pages/customers/CustomersPage';
import LeadsPage from './pages/leads/LeadsPage';
import TasksPage from './pages/tasks/TasksPage';

// Placeholder components for detail pages
const CustomerDetail = () => <div className="p-4"><h1 className="text-2xl font-bold">Customer Detail</h1><p>This page will display customer details.</p></div>;
const LeadDetail = () => <div className="p-4"><h1 className="text-2xl font-bold">Lead Detail</h1><p>This page will display lead details.</p></div>;
const TaskDetail = () => <div className="p-4"><h1 className="text-2xl font-bold">Task Detail</h1><p>This page will display task details.</p></div>;
const Settings = () => <div className="p-4"><h1 className="text-2xl font-bold">Settings Page</h1><p>This page will allow users to manage their settings.</p></div>;

function App() {
  console.log('App component is rendering');

  return (
    <div className="min-h-screen bg-gray-100">
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/customers/:id" element={<CustomerDetail />} />
              <Route path="/leads" element={<LeadsPage />} />
              <Route path="/leads/:id" element={<LeadDetail />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/tasks/:id" element={<TaskDetail />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* Default routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
