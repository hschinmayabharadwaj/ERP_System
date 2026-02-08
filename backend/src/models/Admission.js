const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  applicationId: {
    type: String,
    required: true,
    unique: true
  },
  personalInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: { type: String, default: 'India' }
    }
  },
  guardianInfo: {
    name: { type: String, required: true },
    relationship: String,
    phone: { type: String, required: true },
    email: String,
    occupation: String
  },
  academicInfo: {
    previousSchool: String,
    previousGrade: String,
    percentage: Number,
    appliedCourse: { type: String, required: true },
    appliedYear: { type: Number, required: true }
  },
  documents: [{
    type: { type: String, required: true },
    filename: String,
    path: String,
    verified: { type: Boolean, default: false },
    uploadedAt: { type: Date, default: Date.now }
  }],
  status: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected', 'waitlisted'],
    default: 'pending'
  },
  reviewNotes: [{
    note: String,
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date, default: Date.now }
  }],
  interviewSchedule: {
    date: Date,
    time: String,
    mode: { type: String, enum: ['online', 'offline'] },
    link: String,
    venue: String
  },
  convertedToStudent: {
    type: Boolean,
    default: false
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    default: null
  }
}, {
  timestamps: true
});

// Generate application ID before saving
admissionSchema.pre('save', async function(next) {
  if (!this.applicationId) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Admission').countDocuments();
    this.applicationId = `APP${year}${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Admission', admissionSchema);
