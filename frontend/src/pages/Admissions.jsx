import React, { useState } from 'react';
import { UserPlus, Search, Filter, MoreVertical, Eye, Edit, Trash2, Download } from 'lucide-react';

const Admissions = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const admissions = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@email.com',
      course: 'Computer Science',
      applicationDate: '2024-01-15',
      status: 'approved',
      phone: '+1 234 567 8900'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
      course: 'Business Administration',
      applicationDate: '2024-01-14',
      status: 'pending',
      phone: '+1 234 567 8901'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@email.com',
      course: 'Engineering',
      applicationDate: '2024-01-13',
      status: 'review',
      phone: '+1 234 567 8902'
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@email.com',
      course: 'Medicine',
      applicationDate: '2024-01-12',
      status: 'approved',
      phone: '+1 234 567 8903'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'status-active';
      case 'pending': return 'status-pending';
      case 'review': return 'status-inactive';
      default: return 'status-pending';
    }
  };

  const filteredAdmissions = admissions.filter(admission => {
    const matchesSearch = admission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admission.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || admission.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Admissions Management</h1>
          <p className="text-slate-400 text-lg">Manage student applications and admissions process</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <UserPlus size={20} />
          Add New Application
        </button>
      </div>

      {/* Filters and Search */}
      <div className="erp-card">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-slate-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="form-select"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="review">Under Review</option>
                <option value="approved">Approved</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-secondary flex items-center gap-2">
              <Download size={18} />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="erp-card">
        <div className="card-header">
          <h3 className="card-title">Student Applications ({filteredAdmissions.length})</h3>
        </div>
        <div className="table-container">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Application Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmissions.map((admission) => (
                <tr key={admission.id} className="table-row">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">{admission.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-white">{admission.name}</p>
                        <p className="text-sm text-slate-400">{admission.email}</p>
                        <p className="text-xs text-slate-500">{admission.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="font-medium">{admission.course}</span>
                  </td>
                  <td className="table-cell">{admission.applicationDate}</td>
                  <td className="table-cell">
                    <span className={`badge ${getStatusColor(admission.status)}`}>
                      {admission.status}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg bg-slate-800/50 hover:bg-blue-500/20 text-blue-400 transition-colors">
                        <Eye size={16} />
                      </button>
                      <button className="p-2 rounded-lg bg-slate-800/50 hover:bg-green-500/20 text-green-400 transition-colors">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 rounded-lg bg-slate-800/50 hover:bg-red-500/20 text-red-400 transition-colors">
                        <Trash2 size={16} />
                      </button>
                      <button className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 text-slate-400 transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Application Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-2xl font-bold text-white">New Application</h2>
              <p className="text-slate-400 mt-1">Add a new student application</p>
            </div>
            <div className="p-6">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-input" placeholder="Enter full name" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input type="email" className="form-input" placeholder="Enter email address" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input type="tel" className="form-input" placeholder="Enter phone number" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Course</label>
                    <select className="form-select">
                      <option value="">Select a course</option>
                      <option value="computer-science">Computer Science</option>
                      <option value="business">Business Administration</option>
                      <option value="engineering">Engineering</option>
                      <option value="medicine">Medicine</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date of Birth</label>
                    <input type="date" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select className="form-select">
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Address</label>
                  <textarea className="form-textarea" rows={3} placeholder="Enter full address"></textarea>
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="submit" className="btn btn-primary flex-1">
                    Create Application
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsFormOpen(false)}
                    className="btn btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admissions;