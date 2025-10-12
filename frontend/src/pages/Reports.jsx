import React, { useState } from 'react';
import { FileText, Download, Calendar, Filter, BarChart3, PieChart, TrendingUp, Users, DollarSign, Building } from 'lucide-react';

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState('overview');
  const [dateRange, setDateRange] = useState('month');

  const reportTypes = [
    {
      id: 'overview',
      title: 'Overview Report',
      description: 'Comprehensive overview of all activities',
      icon: BarChart3,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'admissions',
      title: 'Admissions Report',
      description: 'Student admissions and enrollment data',
      icon: Users,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'fees',
      title: 'Fee Collection Report',
      description: 'Payment and fee collection analytics',
      icon: DollarSign,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'hostel',
      title: 'Hostel Report',
      description: 'Room occupancy and hostel management',
      icon: Building,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const quickStats = [
    {
      title: 'Total Students',
      value: '1,248',
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-400'
    },
    {
      title: 'Fee Collection',
      value: '₹2,45,000',
      change: '+8%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-400'
    },
    {
      title: 'Occupancy Rate',
      value: '85%',
      change: '+5%',
      trend: 'up',
      icon: Building,
      color: 'text-purple-400'
    },
    {
      title: 'New Admissions',
      value: '156',
      change: '+23%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-orange-400'
    }
  ];

  const recentReports = [
    {
      id: 1,
      name: 'Monthly Fee Collection Report',
      type: 'Financial',
      generatedDate: '2024-01-30',
      status: 'completed',
      size: '2.4 MB'
    },
    {
      id: 2,
      name: 'Student Enrollment Analysis',
      type: 'Academic',
      generatedDate: '2024-01-29',
      status: 'completed',
      size: '1.8 MB'
    },
    {
      id: 3,
      name: 'Hostel Occupancy Report',
      type: 'Administrative',
      generatedDate: '2024-01-28',
      status: 'completed',
      size: '1.2 MB'
    },
    {
      id: 4,
      name: 'Quarterly Performance Report',
      type: 'Academic',
      generatedDate: '2024-01-25',
      status: 'processing',
      size: 'Processing...'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'status-active';
      case 'processing': return 'status-pending';
      case 'failed': return 'status-inactive';
      default: return 'status-pending';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Reports & Analytics</h1>
          <p className="text-slate-400 text-lg">Generate and analyze institutional reports</p>
        </div>
        <div className="flex gap-3">
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="form-select"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="btn btn-primary flex items-center gap-2">
            <Download size={20} />
            Export All
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="dashboard-grid">
        {quickStats.map((stat, index) => (
          <div key={index} className="dashboard-stat-card">
            <div className="flex items-start justify-between mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                stat.trend === 'up' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
              }`}>
                <TrendingUp size={16} />
                {stat.change}
              </div>
            </div>
            <div>
              <p className="stat-number">{stat.value}</p>
              <p className="stat-label">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Report Types */}
      <div className="erp-card">
        <div className="card-header">
          <h3 className="card-title flex items-center gap-3">
            <FileText size={24} className="text-blue-400" />
            Generate Reports
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reportTypes.map((report) => (
            <div 
              key={report.id}
              className={`p-6 rounded-xl border transition-all cursor-pointer ${
                selectedReport === report.id
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
              }`}
              onClick={() => setSelectedReport(report.id)}
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${report.color} rounded-xl flex items-center justify-center mb-4`}>
                <report.icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-white font-semibold mb-2">{report.title}</h4>
              <p className="text-slate-400 text-sm">{report.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Report Generation Form */}
      <div className="erp-card">
        <div className="card-header">
          <h3 className="card-title">Generate {reportTypes.find(r => r.id === selectedReport)?.title}</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="form-group">
              <label className="form-label">Date Range</label>
              <div className="grid grid-cols-2 gap-4">
                <input type="date" className="form-input" />
                <input type="date" className="form-input" />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Report Format</label>
              <select className="form-select">
                <option value="pdf">PDF Document</option>
                <option value="excel">Excel Spreadsheet</option>
                <option value="csv">CSV File</option>
                <option value="json">JSON Data</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Include Sections</label>
              <div className="space-y-3">
                {[
                  'Summary Statistics',
                  'Detailed Analytics',
                  'Charts and Graphs',
                  'Comparative Analysis',
                  'Recommendations'
                ].map((section) => (
                  <label key={section} className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-slate-300">{section}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                <PieChart size={20} className="text-blue-400" />
                Report Preview
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Data Points:</span>
                  <span className="text-white font-medium">1,248 records</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Time Period:</span>
                  <span className="text-white font-medium">Last 30 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Estimated Size:</span>
                  <span className="text-white font-medium">2.4 MB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Generation Time:</span>
                  <span className="text-white font-medium">~30 seconds</span>
                </div>
              </div>
            </div>
            
            <button className="btn btn-primary w-full flex items-center justify-center gap-2">
              <FileText size={20} />
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="erp-card">
        <div className="card-header">
          <h3 className="card-title">Recent Reports</h3>
        </div>
        <div className="table-container">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th>Report Name</th>
                <th>Type</th>
                <th>Generated Date</th>
                <th>Status</th>
                <th>Size</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentReports.map((report) => (
                <tr key={report.id} className="table-row">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <FileText size={18} className="text-white" />
                      </div>
                      <span className="font-medium text-white">{report.name}</span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="px-3 py-1 bg-slate-700 text-slate-300 rounded-lg text-sm">
                      {report.type}
                    </span>
                  </td>
                  <td className="table-cell">{report.generatedDate}</td>
                  <td className="table-cell">
                    <span className={`badge ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="table-cell">{report.size}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      {report.status === 'completed' && (
                        <button className="p-2 rounded-lg bg-slate-800/50 hover:bg-green-500/20 text-green-400 transition-colors">
                          <Download size={16} />
                        </button>
                      )}
                      <button className="p-2 rounded-lg bg-slate-800/50 hover:bg-blue-500/20 text-blue-400 transition-colors">
                        <FileText size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;