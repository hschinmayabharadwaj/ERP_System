import React from 'react';
import { Users, DollarSign, Building, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Students',
      value: '1,248',
      change: '+12%',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Fee Collection',
      value: '₹2,45,000',
      change: '+8%',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Hostel Occupancy',
      value: '85%',
      change: '+5%',
      icon: Building,
      color: 'bg-purple-500'
    },
    {
      title: 'Active Admissions',
      value: '156',
      change: '+23%',
      icon: TrendingUp,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to the ERP System Dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className="text-sm text-green-600 mt-2">{stat.change} from last month</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Admissions</h3>
          <div className="space-y-3">
            {[
              { name: 'John Doe', course: 'Computer Science', date: '2024-01-15' },
              { name: 'Jane Smith', course: 'Business Administration', date: '2024-01-14' },
              { name: 'Mike Johnson', course: 'Engineering', date: '2024-01-13' }
            ].map((student, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <div>
                  <p className="font-medium text-gray-900">{student.name}</p>
                  <p className="text-sm text-gray-600">{student.course}</p>
                </div>
                <span className="text-sm text-gray-500">{student.date}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Payments</h3>
          <div className="space-y-3">
            {[
              { name: 'Alice Brown', amount: '₹15,000', due: '2024-01-20' },
              { name: 'Bob Wilson', amount: '₹12,500', due: '2024-01-18' },
              { name: 'Carol Davis', amount: '₹8,000', due: '2024-01-16' }
            ].map((payment, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <div>
                  <p className="font-medium text-gray-900">{payment.name}</p>
                  <p className="text-sm text-red-600">Due: {payment.due}</p>
                </div>
                <span className="font-semibold text-gray-900">{payment.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;