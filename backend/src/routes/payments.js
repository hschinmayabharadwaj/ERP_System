const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Fee = require('../models/Fee');
const { authenticate, authorize, asyncHandler } = require('../middleware/auth');

// Get all payments with filters
router.get('/', authenticate, asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    studentId = '',
    paymentMethod = '',
    status = '',
    startDate = '',
    endDate = ''
  } = req.query;

  const query = {};
  if (studentId) query.studentId = studentId;
  if (paymentMethod) query.paymentMethod = paymentMethod;
  if (status) query.status = status;
  
  if (startDate || endDate) {
    query.paymentDate = {};
    if (startDate) query.paymentDate.$gte = new Date(startDate);
    if (endDate) query.paymentDate.$lte = new Date(endDate);
  }

  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));

  const payments = await Payment.find(query)
    .populate('studentId', 'studentId personalInfo.firstName personalInfo.lastName')
    .populate('receivedBy', 'firstName lastName')
    .select('-__v')
    .sort({ paymentDate: -1 })
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum);

  const total = await Payment.countDocuments(query);

  res.json({
    payments,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum)
    }
  });
}));

// Record new payment
router.post('/', authenticate, authorize('admin', 'accountant'), asyncHandler(async (req, res) => {
  const {
    studentId,
    feeId,
    amount,
    paymentMethod,
    paymentDetails,
    academicYear,
    semester,
    feeType,
    remarks
  } = req.body;

  // Input validation
  if (!studentId || !amount || !paymentMethod) {
    return res.status(400).json({ error: 'studentId, amount, and paymentMethod are required' });
  }

  if (amount <= 0 || isNaN(amount)) {
    return res.status(400).json({ error: 'Valid amount is required' });
  }

  // Validate payment method
  const validMethods = ['cash', 'cheque', 'dd', 'online', 'card', 'upi', 'bank_transfer'];
  if (!validMethods.includes(paymentMethod)) {
    return res.status(400).json({ error: 'Invalid payment method' });
  }

  // Create payment
  const payment = new Payment({
    studentId,
    feeId,
    amount,
    paymentMethod,
    paymentDetails,
    academicYear,
    semester,
    feeType,
    remarks,
    receivedBy: req.userId
  });

  await payment.save();

  // Update fee record if feeId provided
  if (feeId) {
    const fee = await Fee.findById(feeId);
    if (fee) {
      fee.paidAmount += amount;
      fee.pendingAmount = fee.totalAmount - fee.paidAmount;
      
      if (fee.pendingAmount <= 0) {
        fee.status = 'paid';
        fee.pendingAmount = 0;
      } else if (fee.paidAmount > 0) {
        fee.status = 'partial';
      }
      
      fee.payments.push({
        amount,
        paymentMethod,
        transactionId: payment.receiptNumber,
        paymentDate: payment.paymentDate
      });
      
      await fee.save();
    }
  }

  res.status(201).json({ 
    message: 'Payment recorded successfully', 
    payment,
    receiptNumber: payment.receiptNumber
  });
}));

// Get payment statistics
router.get('/stats/overview', authenticate, authorize('admin', 'accountant'), asyncHandler(async (req, res) => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfYear = new Date(today.getFullYear(), 0, 1);

  // Monthly collection
  const monthlyCollection = await Payment.aggregate([
    { $match: { paymentDate: { $gte: startOfMonth }, status: 'completed' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  // Yearly collection
  const yearlyCollection = await Payment.aggregate([
    { $match: { paymentDate: { $gte: startOfYear }, status: 'completed' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  // Payment method distribution
  const methodDistribution = await Payment.aggregate([
    { $match: { status: 'completed' } },
    { $group: { _id: '$paymentMethod', total: { $sum: '$amount' }, count: { $sum: 1 } } }
  ]);

  // Monthly trend (last 6 months)
  const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1);
  const monthlyTrend = await Payment.aggregate([
    { $match: { paymentDate: { $gte: sixMonthsAgo }, status: 'completed' } },
    {
      $group: {
        _id: { 
          year: { $year: '$paymentDate' },
          month: { $month: '$paymentDate' }
        },
        total: { $sum: '$amount' }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  res.json({
    monthlyCollection: monthlyCollection[0]?.total || 0,
    yearlyCollection: yearlyCollection[0]?.total || 0,
    methodDistribution,
    monthlyTrend
  });
}));

// Get student's payment history
router.get('/student/:studentId', authenticate, asyncHandler(async (req, res) => {
  const payments = await Payment.find({ studentId: req.params.studentId })
    .sort({ paymentDate: -1 });
  res.json(payments);
}));

// Get payment by ID
router.get('/:id', authenticate, asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id)
    .populate('studentId', 'studentId personalInfo')
    .populate('feeId')
    .populate('receivedBy', 'firstName lastName');
  
  if (!payment) {
    return res.status(404).json({ error: 'Payment not found' });
  }
  res.json(payment);
}));

module.exports = router;
