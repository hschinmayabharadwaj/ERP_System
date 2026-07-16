const express = require('express');
const router = express.Router();
const Fee = require('../models/Fee');
const Student = require('../models/Student');
const { authenticate, authorize, asyncHandler } = require('../middleware/auth');

// Get all fee records with filters
router.get('/', authenticate, asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    academicYear = '',
    semester = '',
    status = '',
    studentId = ''
  } = req.query;

  const query = {};
  if (academicYear) query.academicYear = academicYear;
  if (semester) query.semester = parseInt(semester);
  if (status) query.status = status;
  if (studentId) query.studentId = studentId;

  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));

  const fees = await Fee.find(query)
    .populate('studentId', 'studentId personalInfo.firstName personalInfo.lastName')
    .select('-__v')
    .sort({ createdAt: -1 })
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum);

  const total = await Fee.countDocuments(query);

  res.json({
    fees,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum)
    }
  });
}));

// Create fee record for student
router.post('/', authenticate, authorize('admin', 'accountant'), asyncHandler(async (req, res) => {
  const { studentId, academicYear, semester, feeStructure, dueDate } = req.body;

  // Input validation
  if (!studentId || !academicYear || !feeStructure) {
    return res.status(400).json({ error: 'studentId, academicYear, and feeStructure are required' });
  }

  // Verify student exists
  const student = await Student.findById(studentId);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  // Calculate total
  const totalAmount = Object.values(feeStructure).reduce((sum, val) => sum + (Number(val) || 0), 0);

  const fee = new Fee({
    studentId,
    academicYear,
    semester,
    feeStructure,
    totalAmount,
    pendingAmount: totalAmount,
    dueDate
  });

  await fee.save();
  res.status(201).json({ message: 'Fee record created', fee });
}));

// Update fee record
router.put('/:id', authenticate, authorize('admin', 'accountant'), asyncHandler(async (req, res) => {
  const fee = await Fee.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  if (!fee) {
    return res.status(404).json({ error: 'Fee record not found' });
  }

  res.json({ message: 'Fee record updated', fee });
}));

// Get fee statistics
router.get('/stats/overview', authenticate, authorize('admin', 'accountant'), asyncHandler(async (req, res) => {
  const stats = await Fee.aggregate([
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$totalAmount' },
        collectedAmount: { $sum: '$paidAmount' },
        pendingAmount: { $sum: '$pendingAmount' }
      }
    }
  ]);

  const statusCounts = await Fee.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  res.json({
    summary: stats[0] || { totalAmount: 0, collectedAmount: 0, pendingAmount: 0 },
    statusCounts
  });
}));

// Get student's fee history
router.get('/student/:studentId', authenticate, asyncHandler(async (req, res) => {
  const fees = await Fee.find({ studentId: req.params.studentId })
    .sort({ academicYear: -1, semester: -1 });
  res.json(fees);
}));

// Get fee by ID
router.get('/:id', authenticate, asyncHandler(async (req, res) => {
  const fee = await Fee.findById(req.params.id)
    .populate('studentId', 'studentId personalInfo');
  if (!fee) {
    return res.status(404).json({ error: 'Fee record not found' });
  }
  res.json(fee);
}));

module.exports = router;
