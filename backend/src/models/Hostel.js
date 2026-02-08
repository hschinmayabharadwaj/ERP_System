const mongoose = require('mongoose');

// Room Schema
const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true
  },
  block: {
    type: String,
    required: true
  },
  floor: {
    type: Number,
    required: true
  },
  roomType: {
    type: String,
    enum: ['single', 'double', 'triple', 'dormitory'],
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  currentOccupancy: {
    type: Number,
    default: 0
  },
  amenities: [{
    type: String,
    enum: ['ac', 'attached_bathroom', 'wifi', 'geyser', 'balcony', 'study_table']
  }],
  monthlyRent: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'maintenance', 'reserved'],
    default: 'available'
  },
  occupants: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    checkInDate: { type: Date, default: Date.now },
    checkOutDate: Date,
    isActive: { type: Boolean, default: true }
  }]
}, {
  timestamps: true
});

// Update status based on occupancy
roomSchema.pre('save', function(next) {
  if (this.currentOccupancy >= this.capacity) {
    this.status = 'occupied';
  } else if (this.currentOccupancy > 0) {
    this.status = 'available';
  }
  next();
});

// Hostel Block Schema
const hostelBlockSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['boys', 'girls'],
    required: true
  },
  totalFloors: {
    type: Number,
    required: true
  },
  totalRooms: {
    type: Number,
    required: true
  },
  warden: {
    name: String,
    phone: String,
    email: String
  },
  facilities: [String],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Room = mongoose.model('Room', roomSchema);
const HostelBlock = mongoose.model('HostelBlock', hostelBlockSchema);

module.exports = { Room, HostelBlock };
