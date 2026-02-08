const express = require('express');
const router = express.Router();
const Fee = require('../models/Fee');
const Student = require('../models/Student');
const { authenticate, authorize } = require('../middleware/auth');

// Get all fee records with filters
router.get('/', authenticate, async (req, res) => {
  try {
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

    const fees = await Fee.find(query)
      .populate('studentId', 'studentId personalInfo.firstName personalInfo.lastName')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Fee.countDocuments(query);

    res.json({
      fees,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get fee by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id)
      .populate('studentId', 'studentId personalInfo');
    if (!fee) {
      return res.status(404).json({ error: 'Fee record not found' });
    }
    res.json(fee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create fee record for student
router.post('/', authenticate, authorize('admin', 'accountant'), async (req, res) => {
  try {
    const { studentId, academicYear, semester, feeStructure, dueDate } = req.body;

    // Calculate total
    const totalAmount = Object.values(feeStructure).reduce((sum, val) => sum + (val || 0), 0);

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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update fee record
router.put('/:id', authenticate, authorize('admin', 'accountant'), async (req, res) => {
  try {
    const fee = await Fee.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!fee) {
      return res.status(404).json({ error: 'Fee record not found' });
    }

    res.json({ message: 'Fee record updated', fee });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get fee statistics
router.get('/stats/overview', authenticate, async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get student's fee history
router.get('/student/:studentId', authenticate, async (req, res) => {
  try {
    const fees = await Fee.find({ studentId: req.params.studentId })
      .sort({ academicYear: -1, semester: -1 });
    res.json(fees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
