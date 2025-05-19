import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Dashboard Pages
import Dashboard from './pages/Dashboard';

// Placeholder components for other pages
const Customers = () => <div className="p-4"><h1 className="text-2xl font-bold">Customers Page</h1><p>This page will display the list of customers.</p></div>;
const CustomerDetail = () => <div className="p-4"><h1 className="text-2xl font-bold">Customer Detail</h1><p>This page will display customer details.</p></div>;
const Leads = () => <div className="p-4"><h1 className="text-2xl font-bold">Leads Page</h1><p>This page will display the list of leads.</p></div>;
const LeadDetail = () => <div className="p-4"><h1 className="text-2xl font-bold">Lead Detail</h1><p>This page will display lead details.</p></div>;
const Tasks = () => <div className="p-4"><h1 className="text-2xl font-bold">Tasks Page</h1><p>This page will display the list of tasks.</p></div>;
const TaskDetail = () => <div className="p-4"><h1 className="text-2xl font-bold">Task Detail</h1><p>This page will display task details.</p></div>;
const Settings = () => <div className="p-4"><h1 className="text-2xl font-bold">Settings Page</h1><p>This page will allow users to manage their settings.</p></div>;

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/:id" element={<CustomerDetail />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/leads/:id" element={<LeadDetail />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/tasks/:id" element={<TaskDetail />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Redirect to dashboard if authenticated, otherwise to login */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
