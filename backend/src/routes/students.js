const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { authenticate, authorize } = require('../middleware/auth');

// Get all students with pagination and filters
router.get('/', authenticate, async (req, res) => {
  try {
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

    // Search filter
    if (search) {
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

    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const students = await Student.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Student.countDocuments(query);

    res.json({
      students,
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

// Create new student
router.post('/', authenticate, authorize('admin', 'staff'), async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update student
router.put('/:id', authenticate, authorize('admin', 'staff'), async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ message: 'Student updated successfully', student });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete student
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get student statistics
router.get('/stats/overview', authenticate, async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get student by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
