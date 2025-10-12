import React from 'react';
import { Users, DollarSign, Building, TrendingUp, Calendar, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const Dashboard = () => {

  const stats = [
    {
      title: 'Total Students',
      value: '1,248',
      change: '+12%',
      trend: 'up',
      icon: Users,
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Fee Collection',
      value: '₹2,45,000',
      change: '+8%',
      trend: 'up',
      icon: DollarSign,
      gradient: 'from-green-500 to-green-600'
    },
    {
      title: 'Hostel Occupancy',
      value: '85%',
      change: '+5%',
      trend: 'up',
      icon: Building,
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Active Admissions',
      value: '156',
      change: '+23%',
      trend: 'up',
      icon: TrendingUp,
      gradient: 'from-orange-500 to-orange-600'
    }
  ];

  const recentActivities = [
    { name: 'John Doe', course: 'Computer Science', date: '2024-01-15', status: 'approved' },
    { name: 'Jane Smith', course: 'Business Administration', date: '2024-01-14', status: 'pending' },
    { name: 'Mike Johnson', course: 'Engineering', date: '2024-01-13', status: 'approved' },
    { name: 'Sarah Wilson', course: 'Medicine', date: '2024-01-12', status: 'review' }
  ];

  const pendingPayments = [
    { name: 'Alice Brown', amount: '₹15,000', due: '2024-01-20', priority: 'high' },
    { name: 'Bob Wilson', amount: '₹12,500', due: '2024-01-18', priority: 'medium' },
    { name: 'Carol Davis', amount: '₹8,000', due: '2024-01-16', priority: 'high' },
    { name: 'David Lee', amount: '₹22,000', due: '2024-01-25', priority: 'low' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'status-active';
      case 'pending': return 'status-pending';
      case 'review': return 'status-inactive';
      default: return 'status-pending';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="space-y-8">
      {/* Animated Header Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 opacity-90"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 animate-pulse"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce delay-100"></div>
        <div className="absolute top-20 right-20 w-16 h-16 bg-white/10 rounded-full animate-bounce delay-300"></div>
        <div className="absolute bottom-10 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-bounce delay-500"></div>
        <div className="absolute bottom-20 right-1/3 w-14 h-14 bg-white/10 rounded-full animate-bounce delay-700"></div>
        
        {/* Main Content */}
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 p-8 lg:p-12">
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-spin-slow">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-6xl lg:text-7xl font-black text-white mb-2 animate-fade-in-up">
                  ERP System
                </h1>
                <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            <p className="text-slate-200 text-xl lg:text-2xl font-medium animate-fade-in-up delay-200">
              Complete Educational Management Solution
            </p>
            <p className="text-slate-300 text-lg animate-fade-in-up delay-300">
              Streamline admissions, manage fees, oversee hostels, and generate comprehensive reports
            </p>
          </div>
          
          <div className="flex flex-col gap-4 animate-fade-in-right">
            <div className="flex items-center gap-3 text-slate-200 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <Calendar size={24} className="text-yellow-400" />
              <div>
                <p className="font-semibold">Today</p>
                <p className="text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
            <button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3">
              <Clock size={20} />
              Generate Report
            </button>
          </div>
        </div>
        
        {/* Wave Animation at Bottom */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg className="relative block w-full h-20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
                  fill="rgba(255,255,255,0.1)" className="animate-wave"></path>
          </svg>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="dashboard-grid">
        {stats.map((stat, index) => (
          <div key={index} className="dashboard-stat-card group">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-16 h-16 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                stat.trend === 'up' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
              }`}>
                {stat.trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                {stat.change}
              </div>
            </div>
            <div>
              <p className="stat-number">{stat.value}</p>
              <p className="stat-label">{stat.title}</p>
              <p className="text-xs text-slate-500 mt-2">vs last month</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Admissions */}
        <div className="xl:col-span-2">
          <div className="erp-card">
            <div className="card-header">
              <h3 className="card-title flex items-center gap-3">
                <Users size={24} className="text-blue-400" />
                Recent Admissions
              </h3>
            </div>
            <div className="table-container">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th>Student Name</th>
                    <th>Course</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivities.map((student, index) => (
                    <tr key={index} className="table-row">
                      <td className="table-cell">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">{student.name.charAt(0)}</span>
                          </div>
                          <span className="font-medium text-white">{student.name}</span>
                        </div>
                      </td>
                      <td className="table-cell">{student.course}</td>
                      <td className="table-cell">{student.date}</td>
                      <td className="table-cell">
                        <span className={`badge ${getStatusColor(student.status)}`}>
                          {student.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6">
              <button className="btn btn-secondary w-full">View All Admissions</button>
            </div>
          </div>
        </div>

        {/* Pending Payments */}
        <div>
          <div className="erp-card">
            <div className="card-header">
              <h3 className="card-title flex items-center gap-3">
                <DollarSign size={24} className="text-green-400" />
                Pending Payments
              </h3>
            </div>
            <div className="space-y-4">
              {pendingPayments.map((payment, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">{payment.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-white">{payment.name}</p>
                      <p className="text-sm text-slate-400">Due: {payment.due}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">{payment.amount}</p>
                    <p className={`text-xs font-medium ${getPriorityColor(payment.priority)}`}>
                      {payment.priority} priority
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <button className="btn btn-success w-full">Manage Payments</button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="erp-card">
        <div className="card-header">
          <h3 className="card-title">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="btn btn-primary flex flex-col items-center gap-3 p-6 h-auto">
            <Users size={24} />
            <span>Add Student</span>
          </button>
          <button className="btn btn-secondary flex flex-col items-center gap-3 p-6 h-auto">
            <DollarSign size={24} />
            <span>Record Payment</span>
          </button>
          <button className="btn btn-secondary flex flex-col items-center gap-3 p-6 h-auto">
            <Building size={24} />
            <span>Assign Room</span>
          </button>
          <button className="btn btn-secondary flex flex-col items-center gap-3 p-6 h-auto">
            <TrendingUp size={24} />
            <span>View Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;