const express = require('express');
const router = express.Router();
const { Room, HostelBlock } = require('../models/Hostel');
const Student = require('../models/Student');
const { authenticate, authorize } = require('../middleware/auth');

// ==================== ROOMS ====================

// Get all rooms with filters
router.get('/rooms', authenticate, async (req, res) => {
  try {
    const { block, floor, status, roomType } = req.query;

    const query = {};
    if (block) query.block = block;
    if (floor) query.floor = parseInt(floor);
    if (status) query.status = status;
    if (roomType) query.roomType = roomType;

    const rooms = await Room.find(query)
      .populate('occupants.student', 'studentId personalInfo.firstName personalInfo.lastName')
      .sort({ block: 1, floor: 1, roomNumber: 1 });

    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get room by ID
router.get('/rooms/:id', authenticate, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('occupants.student', 'studentId personalInfo academicInfo');
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create room
router.post('/rooms', authenticate, authorize('admin', 'hostel_warden'), async (req, res) => {
  try {
    const room = new Room(req.body);
    await room.save();
    res.status(201).json({ message: 'Room created successfully', room });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update room
router.put('/rooms/:id', authenticate, authorize('admin', 'hostel_warden'), async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.json({ message: 'Room updated successfully', room });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Allocate room to student
router.post('/rooms/:roomId/allocate', authenticate, authorize('admin', 'hostel_warden'), async (req, res) => {
  try {
    const { studentId } = req.body;
    const room = await Room.findById(req.params.roomId);

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if (room.currentOccupancy >= room.capacity) {
      return res.status(400).json({ error: 'Room is at full capacity' });
    }

    // Check if student already has a room
    const existingRoom = await Room.findOne({
      'occupants.student': studentId,
      'occupants.isActive': true
    });

    if (existingRoom) {
      return res.status(400).json({ error: 'Student already has a room allocated' });
    }

    // Add student to room
    room.occupants.push({ student: studentId, checkInDate: new Date() });
    room.currentOccupancy += 1;
    await room.save();

    // Update student hostel info
    await Student.findByIdAndUpdate(studentId, {
      'hostelInfo.isHostelResident': true,
      'hostelInfo.roomNumber': room.roomNumber,
      'hostelInfo.checkInDate': new Date()
    });

    res.json({ message: 'Room allocated successfully', room });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Deallocate room from student
router.post('/rooms/:roomId/deallocate', authenticate, authorize('admin', 'hostel_warden'), async (req, res) => {
  try {
    const { studentId } = req.body;
    const room = await Room.findById(req.params.roomId);

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const occupantIndex = room.occupants.findIndex(
      o => o.student.toString() === studentId && o.isActive
    );

    if (occupantIndex === -1) {
      return res.status(400).json({ error: 'Student not found in this room' });
    }

    room.occupants[occupantIndex].isActive = false;
    room.occupants[occupantIndex].checkOutDate = new Date();
    room.currentOccupancy -= 1;
    await room.save();

    // Update student hostel info
    await Student.findByIdAndUpdate(studentId, {
      'hostelInfo.isHostelResident': false,
      'hostelInfo.checkOutDate': new Date()
    });

    res.json({ message: 'Room deallocated successfully', room });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== BLOCKS ====================

// Get all blocks
router.get('/blocks', authenticate, async (req, res) => {
  try {
    const blocks = await HostelBlock.find({ isActive: true });
    res.json(blocks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create block
router.post('/blocks', authenticate, authorize('admin'), async (req, res) => {
  try {
    const block = new HostelBlock(req.body);
    await block.save();
    res.status(201).json({ message: 'Block created successfully', block });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== STATISTICS ====================

// Get hostel statistics
router.get('/stats/overview', authenticate, async (req, res) => {
  try {
    const totalRooms = await Room.countDocuments();
    const availableRooms = await Room.countDocuments({ status: 'available' });
    const occupiedRooms = await Room.countDocuments({ status: 'occupied' });
    const maintenanceRooms = await Room.countDocuments({ status: 'maintenance' });

    const occupancyStats = await Room.aggregate([
      {
        $group: {
          _id: null,
          totalCapacity: { $sum: '$capacity' },
          currentOccupancy: { $sum: '$currentOccupancy' }
        }
      }
    ]);

    const blockWiseStats = await Room.aggregate([
      {
        $group: {
          _id: '$block',
          totalRooms: { $sum: 1 },
          totalCapacity: { $sum: '$capacity' },
          currentOccupancy: { $sum: '$currentOccupancy' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      totalRooms,
      availableRooms,
      occupiedRooms,
      maintenanceRooms,
      occupancy: occupancyStats[0] || { totalCapacity: 0, currentOccupancy: 0 },
      blockWiseStats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
