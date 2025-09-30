// Student model for database schema
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true
  },
  personalInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    }
  },
  academicInfo: {
    course: { type: String, required: true },
    semester: { type: Number, required: true },
    enrollmentDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['active', 'inactive', 'graduated', 'dropped'],
      default: 'active'
    }
  },
  documents: [{
    type: { type: String, required: true },
    filename: { type: String, required: true },
    path: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now }
  }],
  hostelInfo: {
    isHostelResident: { type: Boolean, default: false },
    roomNumber: String,
    checkInDate: Date,
    checkOutDate: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);