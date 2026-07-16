const express = require('express');
const router = express.Router();
const Admission = require('../models/Admission');
const Student = require('../models/Student');
const { authenticate, authorize, asyncHandler } = require('../middleware/auth');

// Get all admissions with filters
router.get('/', authenticate, asyncHandler(async (req, res) => {
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
  
  // Limit search to prevent regex DoS
  if (search && search.length <= 50) {
    query.$or = [
      { 'personalInfo.firstName': { $regex: search, $options: 'i' } },
      { 'personalInfo.lastName': { $regex: search, $options: 'i' } },
      { 'personalInfo.email': { $regex: search, $options: 'i' } },
      { applicationId: { $regex: search, $options: 'i' } }
    ];
  }

  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));

  const admissions = await Admission.find(query)
    .select('-__v')
    .sort({ createdAt: -1 })
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum);

  const total = await Admission.countDocuments(query);

  res.json({
    admissions,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum)
    }
  });
}));

// Create new admission application
router.post('/', asyncHandler(async (req, res) => {
  const { personalInfo, academicInfo } = req.body;
  
  // Basic validation
  if (!personalInfo || !personalInfo.firstName || !personalInfo.lastName || !personalInfo.email) {
    return res.status(400).json({ error: 'Personal info with firstName, lastName, and email is required' });
  }
  
  if (!academicInfo || !academicInfo.appliedCourse) {
    return res.status(400).json({ error: 'Academic info with appliedCourse is required' });
  }

  const admission = new Admission(req.body);
  await admission.save();
  res.status(201).json({ 
    message: 'Application submitted successfully',
    applicationId: admission.applicationId,
    admission
  });
}));

// Update admission status
router.put('/:id/status', authenticate, authorize('admin', 'staff'), asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  
  // Validate status
  const validStatuses = ['pending', 'under_review', 'approved', 'rejected'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status. Must be one of: ' + validStatuses.join(', ') });
  }
  
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
}));

// Convert admission to student
router.post('/:id/convert', authenticate, authorize('admin'), asyncHandler(async (req, res) => {
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
}));

// Schedule interview
router.put('/:id/interview', authenticate, authorize('admin', 'staff'), asyncHandler(async (req, res) => {
  const { date, time, mode, link, venue } = req.body;
  
  // Validate interview details
  if (!date || !time || !mode) {
    return res.status(400).json({ error: 'date, time, and mode are required for scheduling interview' });
  }

  const validModes = ['online', 'offline'];
  if (!validModes.includes(mode)) {
    return res.status(400).json({ error: 'mode must be either online or offline' });
  }
  
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
}));

// Get admission statistics
router.get('/stats/overview', authenticate, authorize('admin', 'staff'), asyncHandler(async (req, res) => {
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
}));

// Get admission by ID
router.get('/:id', authenticate, asyncHandler(async (req, res) => {
  const admission = await Admission.findById(req.params.id);
  if (!admission) {
    return res.status(404).json({ error: 'Admission not found' });
  }
  res.json(admission);
}));

module.exports = router;
