import React, { useState } from 'react';
import { Building, Users, Bed, Plus, Search, Filter, MapPin, Phone, Mail } from 'lucide-react';

const Hostel = () => {
  const [activeTab, setActiveTab] = useState('rooms');
  const [isRoomFormOpen, setIsRoomFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const rooms = [
    {
      id: 1,
      number: 'A101',
      type: 'Single',
      capacity: 1,
      occupied: 1,
      status: 'occupied',
      floor: 1,
      block: 'A',
      amenities: ['AC', 'WiFi', 'Attached Bathroom']
    },
    {
      id: 2,
      number: 'A102',
      type: 'Double',
      capacity: 2,
      occupied: 1,
      status: 'partial',
      floor: 1,
      block: 'A',
      amenities: ['AC', 'WiFi', 'Shared Bathroom']
    },
    {
      id: 3,
      number: 'B201',
      type: 'Triple',
      capacity: 3,
      occupied: 0,
      status: 'available',
      floor: 2,
      block: 'B',
      amenities: ['Fan', 'WiFi', 'Shared Bathroom']
    },
    {
      id: 4,
      number: 'B202',
      type: 'Double',
      capacity: 2,
      occupied: 2,
      status: 'occupied',
      floor: 2,
      block: 'B',
      amenities: ['AC', 'WiFi', 'Attached Bathroom']
    }
  ];

  const residents = [
    {
      id: 1,
      name: 'John Doe',
      studentId: 'STU001',
      room: 'A101',
      checkIn: '2024-01-15',
      phone: '+1 234 567 8900',
      email: 'john.doe@email.com',
      course: 'Computer Science'
    },
    {
      id: 2,
      name: 'Jane Smith',
      studentId: 'STU002',
      room: 'A102',
      checkIn: '2024-01-10',
      phone: '+1 234 567 8901',
      email: 'jane.smith@email.com',
      course: 'Business Administration'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      studentId: 'STU003',
      room: 'B202',
      checkIn: '2024-01-12',
      phone: '+1 234 567 8902',
      email: 'mike.johnson@email.com',
      course: 'Engineering'
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      studentId: 'STU004',
      room: 'B202',
      checkIn: '2024-01-14',
      phone: '+1 234 567 8903',
      email: 'sarah.wilson@email.com',
      course: 'Medicine'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'status-active';
      case 'occupied': return 'status-inactive';
      case 'partial': return 'status-pending';
      default: return 'status-pending';
    }
  };

  const getRoomStats = () => {
    const total = rooms.length;
    const occupied = rooms.filter(r => r.status === 'occupied').length;
    const available = rooms.filter(r => r.status === 'available').length;
    const partial = rooms.filter(r => r.status === 'partial').length;
    const occupancyRate = ((occupied + partial) / total * 100).toFixed(1);
    
    return { total, occupied, available, partial, occupancyRate };
  };

  const stats = getRoomStats();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Hostel Management</h1>
          <p className="text-slate-400 text-lg">Manage rooms, residents, and hostel operations</p>
        </div>
        <button 
          onClick={() => setIsRoomFormOpen(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Add Room
        </button>
      </div>

      {/* Stats Overview */}
      <div className="dashboard-grid">
        <div className="dashboard-stat-card">
          <div className="flex items-start justify-between mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Building className="w-8 h-8 text-white" />
            </div>
          </div>
          <div>
            <p className="stat-number">{stats.total}</p>
            <p className="stat-label">Total Rooms</p>
          </div>
        </div>
        
        <div className="dashboard-stat-card">
          <div className="flex items-start justify-between mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Bed className="w-8 h-8 text-white" />
            </div>
          </div>
          <div>
            <p className="stat-number">{stats.occupied}</p>
            <p className="stat-label">Occupied</p>
          </div>
        </div>
        
        <div className="dashboard-stat-card">
          <div className="flex items-start justify-between mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>
          <div>
            <p className="stat-number">{stats.available}</p>
            <p className="stat-label">Available</p>
          </div>
        </div>
        
        <div className="dashboard-stat-card">
          <div className="flex items-start justify-between mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <MapPin className="w-8 h-8 text-white" />
            </div>
          </div>
          <div>
            <p className="stat-number">{stats.occupancyRate}%</p>
            <p className="stat-label">Occupancy Rate</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="erp-card">
        <div className="flex gap-1 p-1 bg-slate-800/50 rounded-xl">
          <button
            onClick={() => setActiveTab('rooms')}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'rooms' 
                ? 'bg-blue-500 text-white shadow-lg' 
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Building size={20} className="inline mr-2" />
            Rooms
          </button>
          <button
            onClick={() => setActiveTab('residents')}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'residents' 
                ? 'bg-blue-500 text-white shadow-lg' 
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Users size={20} className="inline mr-2" />
            Residents
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="erp-card">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
          <div className="relative flex-1 max-w-md">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-slate-400" />
            <select className="form-select">
              <option value="all">All {activeTab === 'rooms' ? 'Status' : 'Courses'}</option>
              {activeTab === 'rooms' ? (
                <>
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="partial">Partial</option>
                </>
              ) : (
                <>
                  <option value="cs">Computer Science</option>
                  <option value="business">Business</option>
                  <option value="engineering">Engineering</option>
                  <option value="medicine">Medicine</option>
                </>
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Rooms Tab */}
      {activeTab === 'rooms' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {rooms.map((room) => (
            <div key={room.id} className="erp-card group">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{room.number}</h3>
                  <p className="text-slate-400">{room.type} Room</p>
                </div>
                <span className={`badge ${getStatusColor(room.status)}`}>
                  {room.status}
                </span>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Capacity:</span>
                  <span className="text-white font-medium">{room.capacity} beds</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Occupied:</span>
                  <span className="text-white font-medium">{room.occupied}/{room.capacity}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Floor:</span>
                  <span className="text-white font-medium">{room.floor}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Block:</span>
                  <span className="text-white font-medium">{room.block}</span>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-slate-400 text-sm mb-2">Amenities:</p>
                <div className="flex flex-wrap gap-1">
                  {room.amenities.map((amenity, index) => (
                    <span key={index} className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-lg">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
              
              <button className="btn btn-secondary w-full">
                Manage Room
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Residents Tab */}
      {activeTab === 'residents' && (
        <div className="erp-card">
          <div className="card-header">
            <h3 className="card-title">Current Residents ({residents.length})</h3>
          </div>
          <div className="table-container">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th>Student</th>
                  <th>Room</th>
                  <th>Check-in Date</th>
                  <th>Course</th>
                  <th>Contact</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {residents.map((resident) => (
                  <tr key={resident.id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">{resident.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-white">{resident.name}</p>
                          <p className="text-sm text-slate-400">{resident.studentId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="font-medium">{resident.room}</span>
                    </td>
                    <td className="table-cell">{resident.checkIn}</td>
                    <td className="table-cell">{resident.course}</td>
                    <td className="table-cell">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone size={14} className="text-slate-400" />
                          <span>{resident.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail size={14} className="text-slate-400" />
                          <span>{resident.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <button className="btn btn-secondary btn-sm">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Room Modal */}
      {isRoomFormOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-2xl">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-2xl font-bold text-white">Add New Room</h2>
              <p className="text-slate-400 mt-1">Create a new room in the hostel</p>
            </div>
            <div className="p-6">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label className="form-label">Room Number</label>
                    <input type="text" className="form-input" placeholder="e.g., A101" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Room Type</label>
                    <select className="form-select">
                      <option value="">Select type</option>
                      <option value="single">Single</option>
                      <option value="double">Double</option>
                      <option value="triple">Triple</option>
                      <option value="suite">Suite</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Capacity</label>
                    <input type="number" className="form-input" placeholder="Number of beds" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Floor</label>
                    <input type="number" className="form-input" placeholder="Floor number" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Block</label>
                    <select className="form-select">
                      <option value="">Select block</option>
                      <option value="A">Block A</option>
                      <option value="B">Block B</option>
                      <option value="C">Block C</option>
                      <option value="D">Block D</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Monthly Rent</label>
                    <input type="number" className="form-input" placeholder="Rent amount" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Amenities</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['AC', 'WiFi', 'Attached Bathroom', 'Shared Bathroom', 'Balcony', 'Study Table'].map((amenity) => (
                      <label key={amenity} className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-slate-300">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="submit" className="btn btn-primary flex-1">
                    Create Room
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsRoomFormOpen(false)}
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

export default Hostel;