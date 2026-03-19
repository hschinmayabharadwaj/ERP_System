const express = require('express');
const router = express.Router();
const Admission = require('../models/Admission');
const Student = require('../models/Student');
const { authenticate, authorize } = require('../middleware/auth');

// Get all admissions with filters
router.get('/', authenticate, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status = '',
      course = '',
      year = '',
      search = ''
    } = req.query;

    const query = {};
    if (status) query.status = status;
    if (course) query['academicInfo.appliedCourse'] = course;
    if (year) query['academicInfo.appliedYear'] = parseInt(year);
    
    if (search) {
      query.$or = [
        { 'personalInfo.firstName': { $regex: search, $options: 'i' } },
        { 'personalInfo.lastName': { $regex: search, $options: 'i' } },
        { 'personalInfo.email': { $regex: search, $options: 'i' } },
        { applicationId: { $regex: search, $options: 'i' } }
      ];
    }

    const admissions = await Admission.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Admission.countDocuments(query);

    res.json({
      admissions,
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

// Create new admission application
router.post('/', async (req, res) => {
  try {
    const admission = new Admission(req.body);
    await admission.save();
    res.status(201).json({ 
      message: 'Application submitted successfully',
      applicationId: admission.applicationId,
      admission
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update admission status
router.put('/:id/status', authenticate, authorize('admin', 'staff'), async (req, res) => {
  try {
    const { status, note } = req.body;
    
    const admission = await Admission.findById(req.params.id);
    if (!admission) {
      return res.status(404).json({ error: 'Admission not found' });
    }

    admission.status = status;
    
    if (note) {
      admission.reviewNotes.push({
        note,
        reviewedBy: req.userId
      });
    }

    await admission.save();
    res.json({ message: 'Status updated successfully', admission });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Convert admission to student
router.post('/:id/convert', authenticate, authorize('admin'), async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id);
    
    if (!admission) {
      return res.status(404).json({ error: 'Admission not found' });
    }

    if (admission.status !== 'approved') {
      return res.status(400).json({ error: 'Only approved admissions can be converted' });
    }

    if (admission.convertedToStudent) {
      return res.status(400).json({ error: 'Already converted to student' });
    }

    // Generate student ID
    const year = new Date().getFullYear();
    const count = await Student.countDocuments();
    const studentId = `STU${year}${String(count + 1).padStart(5, '0')}`;

    // Create student from admission
    const student = new Student({
      studentId,
      personalInfo: admission.personalInfo,
      academicInfo: {
        course: admission.academicInfo.appliedCourse,
        semester: 1,
        enrollmentDate: new Date(),
        status: 'active'
      }
    });

    await student.save();

    // Update admission
    admission.convertedToStudent = true;
    admission.studentId = student._id;
    await admission.save();

    res.json({ 
      message: 'Converted to student successfully', 
      student,
      studentId: student.studentId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Schedule interview
router.put('/:id/interview', authenticate, authorize('admin', 'staff'), async (req, res) => {
  try {
    const { date, time, mode, link, venue } = req.body;
    
    const admission = await Admission.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          interviewSchedule: { date, time, mode, link, venue },
          status: 'under_review'
        }
      },
      { new: true }
    );

    if (!admission) {
      return res.status(404).json({ error: 'Admission not found' });
    }

    res.json({ message: 'Interview scheduled successfully', admission });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get admission statistics
router.get('/stats/overview', authenticate, async (req, res) => {
  try {
    const total = await Admission.countDocuments();
    const pending = await Admission.countDocuments({ status: 'pending' });
    const underReview = await Admission.countDocuments({ status: 'under_review' });
    const approved = await Admission.countDocuments({ status: 'approved' });
    const rejected = await Admission.countDocuments({ status: 'rejected' });

    const courseWise = await Admission.aggregate([
      { $group: { _id: '$academicInfo.appliedCourse', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      total,
      pending,
      underReview,
      approved,
      rejected,
      courseWise
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get admission by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id);
    if (!admission) {
      return res.status(404).json({ error: 'Admission not found' });
    }
    res.json(admission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
