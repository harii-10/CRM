import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiTrendingUp, FiCheckSquare, FiAlertCircle } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { dashboardService } from '../services/api';
import { format } from 'date-fns';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-lg shadow p-5">
    <div className="flex items-center">
      <div className={`rounded-full p-3 ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div className="ml-4">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [leadPerformance, setLeadPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const statsData = await dashboardService.getStats();
        const performanceData = await dashboardService.getLeadPerformance();
        
        setStats(statsData);
        setLeadPerformance(performanceData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  // Format lead performance data for chart
  const chartData = leadPerformance.map(item => ({
    date: format(new Date(item._id), 'MMM dd'),
    leads: item.count,
    value: item.value
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your CRM activities and performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Customers" 
          value={stats?.counts.customers || 0} 
          icon={FiUsers} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Active Leads" 
          value={stats?.counts.leads || 0} 
          icon={FiTrendingUp} 
          color="bg-green-500" 
        />
        <StatCard 
          title="Total Tasks" 
          value={stats?.counts.tasks || 0} 
          icon={FiCheckSquare} 
          color="bg-purple-500" 
        />
        <StatCard 
          title="Tasks Due Today" 
          value={stats?.counts.tasksDueToday || 0} 
          icon={FiAlertCircle} 
          color="bg-red-500" 
        />
      </div>

      {/* Lead Performance Chart */}
      <div className="bg-white rounded-lg shadow p-5">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Lead Performance (Last 30 Days)</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="leads" name="New Leads" fill="#8884d8" />
              <Bar yAxisId="right" dataKey="value" name="Value ($)" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 className="text-lg font-medium text-gray-900">Recent Leads</h3>
          </div>
          <ul className="divide-y divide-gray-200">
            {stats?.recentActivities.leads.map((lead) => (
              <li key={lead._id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <Link to={`/leads/${lead._id}`} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-primary-600 truncate">{lead.customer.name}</p>
                    <p className="text-sm text-gray-500">{lead.stage} - ${lead.value}</p>
                  </div>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {lead.source}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <div className="bg-gray-50 px-4 py-4 sm:px-6">
            <Link to="/leads" className="text-sm font-medium text-primary-600 hover:text-primary-500">
              View all leads
            </Link>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 className="text-lg font-medium text-gray-900">Recent Tasks</h3>
          </div>
          <ul className="divide-y divide-gray-200">
            {stats?.recentActivities.tasks.map((task) => (
              <li key={task._id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <Link to={`/tasks/${task._id}`} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-primary-600 truncate">{task.title}</p>
                    <p className="text-sm text-gray-500">
                      Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      task.status === 'Completed' 
                        ? 'bg-green-100 text-green-800' 
                        : task.status === 'In Progress' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {task.status}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <div className="bg-gray-50 px-4 py-4 sm:px-6">
            <Link to="/tasks" className="text-sm font-medium text-primary-600 hover:text-primary-500">
              View all tasks
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
