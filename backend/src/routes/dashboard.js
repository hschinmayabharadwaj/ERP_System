const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Fee = require('../models/Fee');
const Payment = require('../models/Payment');
const Admission = require('../models/Admission');
const { Room } = require('../models/Hostel');
const { authenticate } = require('../middleware/auth');

// Get dashboard overview
router.get('/overview', authenticate, async (req, res) => {
  try {
    // Student stats
    const totalStudents = await Student.countDocuments();
    const activeStudents = await Student.countDocuments({ 'academicInfo.status': 'active' });
    
    // Admission stats
    const pendingAdmissions = await Admission.countDocuments({ status: 'pending' });
    const approvedAdmissions = await Admission.countDocuments({ status: 'approved' });

    // Fee stats
    const feeStats = await Fee.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$totalAmount' },
          collectedAmount: { $sum: '$paidAmount' },
          pendingAmount: { $sum: '$pendingAmount' }
        }
      }
    ]);

    // Hostel stats
    const hostelStats = await Room.aggregate([
      {
        $group: {
          _id: null,
          totalCapacity: { $sum: '$capacity' },
          currentOccupancy: { $sum: '$currentOccupancy' }
        }
      }
    ]);

    // Recent payments (last 5)
    const recentPayments = await Payment.find({ status: 'completed' })
      .populate('studentId', 'studentId personalInfo.firstName personalInfo.lastName')
      .sort({ paymentDate: -1 })
      .limit(5);

    // Recent admissions (last 5)
    const recentAdmissions = await Admission.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      students: {
        total: totalStudents,
        active: activeStudents
      },
      admissions: {
        pending: pendingAdmissions,
        approved: approvedAdmissions
      },
      fees: feeStats[0] || { totalAmount: 0, collectedAmount: 0, pendingAmount: 0 },
      hostel: hostelStats[0] || { totalCapacity: 0, currentOccupancy: 0 },
      recentPayments,
      recentAdmissions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get enrollment trends (last 12 months)
router.get('/trends/enrollment', authenticate, async (req, res) => {
  try {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const trends = await Student.aggregate([
      { $match: { createdAt: { $gte: twelveMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json(trends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get fee collection trends (last 12 months)
router.get('/trends/fees', authenticate, async (req, res) => {
  try {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const trends = await Payment.aggregate([
      { $match: { paymentDate: { $gte: twelveMonthsAgo }, status: 'completed' } },
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

    res.json(trends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get course distribution
router.get('/distribution/courses', authenticate, async (req, res) => {
  try {
    const distribution = await Student.aggregate([
      { $match: { 'academicInfo.status': 'active' } },
      { $group: { _id: '$academicInfo.course', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json(distribution);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get quick stats for dashboard cards
router.get('/quick-stats', authenticate, async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    // This month's payments
    const thisMonthPayments = await Payment.aggregate([
      { $match: { paymentDate: { $gte: startOfMonth }, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Last month's payments
    const lastMonthPayments = await Payment.aggregate([
      { 
        $match: { 
          paymentDate: { $gte: lastMonth, $lte: endOfLastMonth }, 
          status: 'completed' 
        } 
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // This month's new students
    const thisMonthStudents = await Student.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    // Last month's students
    const lastMonthStudents = await Student.countDocuments({
      createdAt: { $gte: lastMonth, $lte: endOfLastMonth }
    });

    // Overdue fees
    const overdueFees = await Fee.countDocuments({
      status: { $in: ['pending', 'partial'] },
      dueDate: { $lt: today }
    });

    res.json({
      payments: {
        thisMonth: thisMonthPayments[0]?.total || 0,
        lastMonth: lastMonthPayments[0]?.total || 0
      },
      newStudents: {
        thisMonth: thisMonthStudents,
        lastMonth: lastMonthStudents
      },
      overdueFees
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
