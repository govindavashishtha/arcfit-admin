import React from 'react';
import { Users, UserCheck, Building, Activity } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  
  // Mock data for dashboard
  const stats = [
    { 
      title: 'Total Members', 
      value: '2,345', 
      change: '+12%', 
      icon: <Users className="h-8 w-8 text-blue-500" />,
      trend: 'up'
    },
    { 
      title: 'Active Trainers', 
      value: '48', 
      change: '+5%', 
      icon: <UserCheck className="h-8 w-8 text-green-500" />,
      trend: 'up'
    },
    { 
      title: 'Society Facilities', 
      value: '18', 
      change: '0%', 
      icon: <Building className="h-8 w-8 text-purple-500" />,
      trend: 'flat'
    },
    { 
      title: 'Weekly Sessions', 
      value: '276', 
      change: '+8%', 
      icon: <Activity className="h-8 w-8 text-red-500" />,
      trend: 'up'
    },
  ];

  return (
    <div className="animate-fadeIn">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Welcome back, {user?.first_name} {user?.last_name}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold mt-1 text-gray-800 dark:text-white">{stat.value}</p>
                <div className={`flex items-center mt-2 ${
                  stat.trend === 'up' 
                    ? 'text-green-500' 
                    : stat.trend === 'down' 
                    ? 'text-red-500' 
                    : 'text-gray-500'
                }`}>
                  <span className="text-sm font-medium">{stat.change}</span>
                  <span className="text-xs ml-1">from last month</span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Activity Overview</h2>
          <div className="h-64 flex items-center justify-center border border-gray-200 dark:border-gray-700 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">Activity chart will be displayed here</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Recent Enrollments</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                  <span className="font-medium text-blue-800 dark:text-blue-200">JD</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">John Doe</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Enrolled: Gym Membership</p>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Today</div>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:underline">
            View all members
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;