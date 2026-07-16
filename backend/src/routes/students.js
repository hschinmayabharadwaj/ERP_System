const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { authenticate, authorize, asyncHandler } = require('../middleware/auth');

// Get all students with pagination and filters
router.get('/', authenticate, asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = '',
    course = '',
    status = '',
    semester = '',
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  const query = {};

  // Sanitize and validate inputs
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));

  // Search filter - limited to prevent regex DoS
  if (search && search.length <= 50) {
    query.$or = [
      { 'personalInfo.firstName': { $regex: search, $options: 'i' } },
      { 'personalInfo.lastName': { $regex: search, $options: 'i' } },
      { 'personalInfo.email': { $regex: search, $options: 'i' } },
      { studentId: { $regex: search, $options: 'i' } }
    ];
  }

  // Other filters
  if (course) query['academicInfo.course'] = course;
  if (status) query['academicInfo.status'] = status;
  if (semester) query['academicInfo.semester'] = parseInt(semester);

  // Validate sortBy to prevent injection
  const allowedSortFields = ['createdAt', 'updatedAt', 'studentId', 'personalInfo.firstName'];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
  const sort = { [sortField]: sortOrder === 'asc' ? 1 : -1 };

  const students = await Student.find(query)
    .select('-__v')  // Exclude internal fields
    .sort(sort)
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum);

  const total = await Student.countDocuments(query);

  res.json({
    students,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum)
    }
  });
}));

// Create new student
router.post('/', authenticate, authorize('admin', 'staff'), asyncHandler(async (req, res) => {
  // Input validation
  const { personalInfo, academicInfo } = req.body;
  
  if (!personalInfo || !personalInfo.firstName || !personalInfo.lastName || !personalInfo.email) {
    return res.status(400).json({ error: 'Personal info with firstName, lastName, and email is required' });
  }

  if (!academicInfo || !academicInfo.course) {
    return res.status(400).json({ error: 'Academic info with course is required' });
  }

  // Generate student ID
  const year = new Date().getFullYear();
  const count = await Student.countDocuments();
  const studentId = `STU${year}${String(count + 1).padStart(5, '0')}`;

  const student = new Student({
    studentId,
    ...req.body
  });

  await student.save();
  res.status(201).json({ message: 'Student created successfully', student });
}));

// Update student
router.put('/:id', authenticate, authorize('admin', 'staff'), asyncHandler(async (req, res) => {
  const student = await Student.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  res.json({ message: 'Student updated successfully', student });
}));

// Delete student
router.delete('/:id', authenticate, authorize('admin'), asyncHandler(async (req, res) => {
  const student = await Student.findByIdAndDelete(req.params.id);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }
  res.json({ message: 'Student deleted successfully' });
}));

// Get student statistics
router.get('/stats/overview', authenticate, authorize('admin', 'staff'), asyncHandler(async (req, res) => {
  const total = await Student.countDocuments();
  const active = await Student.countDocuments({ 'academicInfo.status': 'active' });
  const graduated = await Student.countDocuments({ 'academicInfo.status': 'graduated' });
  const hostelResidents = await Student.countDocuments({ 'hostelInfo.isHostelResident': true });

  // Course-wise distribution
  const courseDistribution = await Student.aggregate([
    { $group: { _id: '$academicInfo.course', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  res.json({
    total,
    active,
    graduated,
    hostelResidents,
    courseDistribution
  });
}));

// Get student by ID
router.get('/:id', authenticate, asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }
  res.json(student);
}));

module.exports = router;
