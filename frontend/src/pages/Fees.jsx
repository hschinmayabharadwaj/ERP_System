import React, { useState } from 'react';
import { CreditCard, Search, Filter, Plus, Download, Eye, DollarSign, Calendar, AlertCircle } from 'lucide-react';

const Fees = () => {
  const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const feeRecords = [
    {
      id: 1,
      studentName: 'John Doe',
      studentId: 'STU001',
      feeType: 'Tuition Fee',
      amount: 25000,
      dueDate: '2024-02-15',
      paidAmount: 25000,
      status: 'paid',
      paymentDate: '2024-01-10'
    },
    {
      id: 2,
      studentName: 'Jane Smith',
      studentId: 'STU002',
      feeType: 'Hostel Fee',
      amount: 15000,
      dueDate: '2024-02-10',
      paidAmount: 0,
      status: 'pending',
      paymentDate: null
    },
    {
      id: 3,
      studentName: 'Mike Johnson',
      studentId: 'STU003',
      feeType: 'Tuition Fee',
      amount: 25000,
      dueDate: '2024-02-20',
      paidAmount: 15000,
      status: 'partial',
      paymentDate: '2024-01-15'
    },
    {
      id: 4,
      studentName: 'Sarah Wilson',
      studentId: 'STU004',
      feeType: 'Lab Fee',
      amount: 5000,
      dueDate: '2024-01-30',
      paidAmount: 0,
      status: 'overdue',
      paymentDate: null
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'status-active';
      case 'pending': return 'status-pending';
      case 'partial': return 'status-inactive';
      case 'overdue': return 'bg-red-900/50 text-red-400 border border-red-500/20';
      default: return 'status-pending';
    }
  };

  const getTotalStats = () => {
    const total = feeRecords.reduce((acc, record) => acc + record.amount, 0);
    const collected = feeRecords.reduce((acc, record) => acc + record.paidAmount, 0);
    const pending = total - collected;
    const overdue = feeRecords.filter(r => r.status === 'overdue').reduce((acc, record) => acc + record.amount, 0);
    
    return { total, collected, pending, overdue };
  };

  const stats = getTotalStats();

  const filteredRecords = feeRecords.filter(record => {
    const matchesSearch = record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.feeType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || record.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Fee Management</h1>
          <p className="text-slate-400 text-lg">Track and manage student fee payments</p>
        </div>
        <button 
          onClick={() => setIsPaymentFormOpen(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Record Payment
        </button>
      </div>

      {/* Stats Overview */}
      <div className="dashboard-grid">
        <div className="dashboard-stat-card">
          <div className="flex items-start justify-between mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
          </div>
          <div>
            <p className="stat-number">₹{stats.total.toLocaleString()}</p>
            <p className="stat-label">Total Fees</p>
          </div>
        </div>
        
        <div className="dashboard-stat-card">
          <div className="flex items-start justify-between mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
          </div>
          <div>
            <p className="stat-number">₹{stats.collected.toLocaleString()}</p>
            <p className="stat-label">Collected</p>
          </div>
        </div>
        
        <div className="dashboard-stat-card">
          <div className="flex items-start justify-between mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Calendar className="w-8 h-8 text-white" />
            </div>
          </div>
          <div>
            <p className="stat-number">₹{stats.pending.toLocaleString()}</p>
            <p className="stat-label">Pending</p>
          </div>
        </div>
        
        <div className="dashboard-stat-card">
          <div className="flex items-start justify-between mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <div>
            <p className="stat-number">₹{stats.overdue.toLocaleString()}</p>
            <p className="stat-label">Overdue</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="erp-card">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search students or fees..."
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
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="partial">Partial</option>
                <option value="overdue">Overdue</option>
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

      {/* Fee Records Table */}
      <div className="erp-card">
        <div className="card-header">
          <h3 className="card-title">Fee Records ({filteredRecords.length})</h3>
        </div>
        <div className="table-container">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th>Student</th>
                <th>Fee Type</th>
                <th>Amount</th>
                <th>Paid</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id} className="table-row">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">{record.studentName.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-white">{record.studentName}</p>
                        <p className="text-sm text-slate-400">{record.studentId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="font-medium">{record.feeType}</span>
                  </td>
                  <td className="table-cell">
                    <span className="font-bold text-white">₹{record.amount.toLocaleString()}</span>
                  </td>
                  <td className="table-cell">
                    <span className={`font-medium ${
                      record.paidAmount === record.amount ? 'text-green-400' : 
                      record.paidAmount > 0 ? 'text-yellow-400' : 'text-slate-400'
                    }`}>
                      ₹{record.paidAmount.toLocaleString()}
                    </span>
                  </td>
                  <td className="table-cell">
                    <span className={new Date(record.dueDate) < new Date() && record.status !== 'paid' ? 'text-red-400' : ''}>
                      {record.dueDate}
                    </span>
                  </td>
                  <td className="table-cell">
                    <span className={`badge ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg bg-slate-800/50 hover:bg-blue-500/20 text-blue-400 transition-colors">
                        <Eye size={16} />
                      </button>
                      <button className="p-2 rounded-lg bg-slate-800/50 hover:bg-green-500/20 text-green-400 transition-colors">
                        <CreditCard size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Form Modal */}
      {isPaymentFormOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-2xl">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-2xl font-bold text-white">Record Payment</h2>
              <p className="text-slate-400 mt-1">Record a new fee payment</p>
            </div>
            <div className="p-6">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label className="form-label">Student</label>
                    <select className="form-select">
                      <option value="">Select student</option>
                      <option value="1">John Doe (STU001)</option>
                      <option value="2">Jane Smith (STU002)</option>
                      <option value="3">Mike Johnson (STU003)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Fee Type</label>
                    <select className="form-select">
                      <option value="">Select fee type</option>
                      <option value="tuition">Tuition Fee</option>
                      <option value="hostel">Hostel Fee</option>
                      <option value="lab">Lab Fee</option>
                      <option value="library">Library Fee</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Amount</label>
                    <input type="number" className="form-input" placeholder="Enter amount" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Payment Method</label>
                    <select className="form-select">
                      <option value="cash">Cash</option>
                      <option value="card">Credit/Debit Card</option>
                      <option value="bank">Bank Transfer</option>
                      <option value="online">Online Payment</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Payment Date</label>
                    <input type="date" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Transaction ID</label>
                    <input type="text" className="form-input" placeholder="Enter transaction ID" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Notes</label>
                  <textarea className="form-textarea" rows={3} placeholder="Additional notes (optional)"></textarea>
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="submit" className="btn btn-success flex-1">
                    Record Payment
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsPaymentFormOpen(false)}
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

export default Fees;