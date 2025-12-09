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
    <div className="space-y-8 w-full">
      {/* Animated Header Section */}
      <div className="relative overflow-hidden rounded-2xl mb-6">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 opacity-90"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 animate-pulse"></div>
        
        {/* Floating Elements - Hidden on mobile for cleaner look */}
        <div className="hidden md:block absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce delay-100"></div>
        <div className="hidden md:block absolute top-20 right-20 w-16 h-16 bg-white/10 rounded-full animate-bounce delay-300"></div>
        <div className="hidden md:block absolute bottom-10 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-bounce delay-500"></div>
        <div className="hidden md:block absolute bottom-20 right-1/3 w-14 h-14 bg-white/10 rounded-full animate-bounce delay-700"></div>
        
        {/* Main Content */}
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 p-6 md:p-8 lg:p-12">
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-3 md:gap-4 mb-4">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-spin-slow flex-shrink-0">
                <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-2 animate-fade-in-up leading-tight">
                  ERP System
                </h1>
                <div className="w-24 md:w-32 h-1 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            <p className="text-slate-200 text-lg md:text-xl lg:text-2xl font-medium animate-fade-in-up delay-200">
              Complete Educational Management Solution
            </p>
            <p className="text-slate-300 text-base md:text-lg animate-fade-in-up delay-300">
              Streamline admissions, manage fees, oversee hostels, and generate comprehensive reports
            </p>
          </div>
          
          <div className="flex flex-col gap-4 animate-fade-in-right lg:min-w-[280px]">
            <div className="flex items-center gap-3 text-slate-200 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <Calendar size={24} className="text-yellow-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-semibold">Today</p>
                <p className="text-xs md:text-sm truncate">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
            <button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 whitespace-nowrap">
              <Clock size={20} />
              <span>Generate Report</span>
            </button>
          </div>
        </div>
        
        {/* Wave Animation at Bottom */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-12 md:h-20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
                  fill="rgba(255,255,255,0.1)" className="animate-wave"></path>
          </svg>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="dashboard-grid">
        {stats.map((stat, index) => (
          <div key={index} className="dashboard-stat-card group">
            <div className="flex items-start justify-between mb-5">
              <div className={`w-16 h-16 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                stat.trend === 'up' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.change}
              </div>
            </div>
            <div>
              <p className="stat-number">{stat.value}</p>
              <p className="stat-label">{stat.title}</p>
              <p className="text-xs text-slate-500 mt-3 font-medium">vs last month</p>
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
              <h3 className="card-title">
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
              <h3 className="card-title">
                <DollarSign size={24} className="text-green-400" />
                Pending Payments
              </h3>
            </div>
            <div className="space-y-3">
              {pendingPayments.map((payment, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-slate-600 hover:bg-slate-800/70 transition-all duration-200">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-11 h-11 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                      <span className="text-white font-semibold text-sm">{payment.name.charAt(0)}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-white truncate">{payment.name}</p>
                      <p className="text-sm text-slate-400">Due: {payment.due}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <p className="font-bold text-white text-lg">{payment.amount}</p>
                    <p className={`text-xs font-semibold ${getPriorityColor(payment.priority)} uppercase`}>
                      {payment.priority}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="btn btn-primary flex flex-col items-center justify-center gap-3 p-6 h-auto min-h-[140px] hover:scale-105 transition-transform">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <Users size={28} />
            </div>
            <span className="text-center font-semibold">Add Student</span>
          </button>
          <button className="btn btn-secondary flex flex-col items-center justify-center gap-3 p-6 h-auto min-h-[140px] hover:scale-105 transition-transform">
            <div className="w-14 h-14 bg-slate-700/50 rounded-xl flex items-center justify-center">
              <DollarSign size={28} />
            </div>
            <span className="text-center font-semibold">Record Payment</span>
          </button>
          <button className="btn btn-secondary flex flex-col items-center justify-center gap-3 p-6 h-auto min-h-[140px] hover:scale-105 transition-transform">
            <div className="w-14 h-14 bg-slate-700/50 rounded-xl flex items-center justify-center">
              <Building size={28} />
            </div>
            <span className="text-center font-semibold">Assign Room</span>
          </button>
          <button className="btn btn-secondary flex flex-col items-center justify-center gap-3 p-6 h-auto min-h-[140px] hover:scale-105 transition-transform">
            <div className="w-14 h-14 bg-slate-700/50 rounded-xl flex items-center justify-center">
              <TrendingUp size={28} />
            </div>
            <span className="text-center font-semibold">View Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;