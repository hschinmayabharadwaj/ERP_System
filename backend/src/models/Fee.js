// Fee model for database schema
const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  academicYear: {
    type: String,
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  feeStructure: {
    tuitionFee: { type: Number, required: true },
    hostelFee: { type: Number, default: 0 },
    libraryFee: { type: Number, default: 0 },
    labFee: { type: Number, default: 0 },
    examFee: { type: Number, default: 0 },
    miscellaneous: { type: Number, default: 0 }
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  pendingAmount: {
    type: Number,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'partial', 'paid', 'overdue'],
    default: 'pending'
  },
  payments: [{
    amount: Number,
    paymentMethod: {
      type: String,
      enum: ['cash', 'online', 'bank_transfer', 'cheque']
    },
    transactionId: String,
    receiptNumber: String,
    paymentDate: { type: Date, default: Date.now },
    remarks: String
  }]
}, {
  timestamps: true
});

// Calculate pending amount before saving
feeSchema.pre('save', function(next) {
  this.pendingAmount = this.totalAmount - this.paidAmount;
  
  // Update status based on payment
  if (this.paidAmount === 0) {
    this.status = 'pending';
  } else if (this.paidAmount < this.totalAmount) {
    this.status = 'partial';
  } else {
    this.status = 'paid';
  }
  
  next();
});

module.exports = mongoose.model('Fee', feeSchema);