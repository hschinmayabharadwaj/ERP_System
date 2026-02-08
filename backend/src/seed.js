// Database Seeding Script
// Run with: node src/seed.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Student = require('./models/Student');
const Admission = require('./models/Admission');
const Fee = require('./models/Fee');
const Payment = require('./models/Payment');
const { Room, HostelBlock } = require('./models/Hostel');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/erp_system';

// Sample data
const courses = ['B.Tech', 'M.Tech', 'MBA', 'B.Com', 'M.Sc', 'BBA'];
const firstNames = ['Rahul', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Anjali', 'Karthik', 'Deepa', 'Arjun', 'Meera'];
const lastNames = ['Sharma', 'Patel', 'Kumar', 'Reddy', 'Gupta', 'Singh', 'Nair', 'Iyer', 'Verma', 'Joshi'];

// Generate random data
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

/**
 * Populate the database with initial ERP data.
 *
 * Establishes a MongoDB connection, clears existing documents from User, Student,
 * Admission, Fee, Payment, Room, and HostelBlock collections, and inserts seed data:
 * an admin and staff users, hostel blocks and rooms, students, admission applications,
 * fee records, and corresponding payment records. Disconnects from MongoDB on completion.
 */
async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Student.deleteMany({}),
      Admission.deleteMany({}),
      Fee.deleteMany({}),
      Payment.deleteMany({}),
      Room.deleteMany({}),
      HostelBlock.deleteMany({})
    ]);
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const adminUser = new User({
      email: 'admin@erpsystem.com',
      password: 'password123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      phone: '+91 98765 43210'
    });
    await adminUser.save();
    console.log('👤 Created admin user (admin@erpsystem.com / password123)');

    // Create staff users
    const staffUsers = await User.insertMany([
      { email: 'staff@erpsystem.com', password: await bcrypt.hash('password123', 10), firstName: 'Staff', lastName: 'Member', role: 'staff' },
      { email: 'accountant@erpsystem.com', password: await bcrypt.hash('password123', 10), firstName: 'Account', lastName: 'Manager', role: 'accountant' },
      { email: 'warden@erpsystem.com', password: await bcrypt.hash('password123', 10), firstName: 'Hostel', lastName: 'Warden', role: 'hostel_warden' }
    ]);
    console.log('👥 Created staff users');

    // Create hostel blocks
    const blocks = await HostelBlock.insertMany([
      { name: 'Block A', type: 'boys', totalFloors: 4, totalRooms: 40, warden: { name: 'Mr. Sharma', phone: '+91 98765 11111', email: 'warden.a@erpsystem.com' }, facilities: ['WiFi', 'Laundry', 'Gym', 'Common Room'] },
      { name: 'Block B', type: 'boys', totalFloors: 3, totalRooms: 30, warden: { name: 'Mr. Kumar', phone: '+91 98765 22222', email: 'warden.b@erpsystem.com' }, facilities: ['WiFi', 'Laundry', 'Study Hall'] },
      { name: 'Block C', type: 'girls', totalFloors: 4, totalRooms: 35, warden: { name: 'Mrs. Patel', phone: '+91 98765 33333', email: 'warden.c@erpsystem.com' }, facilities: ['WiFi', 'Laundry', 'Gym', 'Common Room', 'Cafeteria'] },
      { name: 'Block D', type: 'girls', totalFloors: 2, totalRooms: 20, warden: { name: 'Mrs. Nair', phone: '+91 98765 44444', email: 'warden.d@erpsystem.com' }, facilities: ['WiFi', 'Laundry'] }
    ]);
    console.log('🏢 Created hostel blocks');

    // Create rooms
    const rooms = [];
    const roomTypes = ['single', 'double', 'triple'];
    const amenities = ['ac', 'attached_bathroom', 'wifi', 'study_table'];
    
    for (const block of blocks) {
      for (let floor = 1; floor <= block.totalFloors; floor++) {
        for (let room = 1; room <= 10; room++) {
          const roomType = randomItem(roomTypes);
          const capacity = roomType === 'single' ? 1 : roomType === 'double' ? 2 : 3;
          
          rooms.push({
            roomNumber: `${block.name.replace('Block ', '')}${floor}${String(room).padStart(2, '0')}`,
            block: block.name,
            floor,
            roomType,
            capacity,
            currentOccupancy: randomInt(0, capacity),
            amenities: amenities.slice(0, randomInt(1, 4)),
            monthlyRent: roomType === 'single' ? 8000 : roomType === 'double' ? 5000 : 3500,
            status: Math.random() > 0.1 ? 'available' : 'maintenance'
          });
        }
      }
    }
    await Room.insertMany(rooms);
    console.log(`🛏️  Created ${rooms.length} rooms`);

    // Create students
    const students = [];
    for (let i = 0; i < 100; i++) {
      const firstName = randomItem(firstNames);
      const lastName = randomItem(lastNames);
      const course = randomItem(courses);
      
      students.push({
        studentId: `STU2024${String(i + 1).padStart(5, '0')}`,
        personalInfo: {
          firstName,
          lastName,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@student.edu`,
          phone: `+91 ${randomInt(70000, 99999)} ${randomInt(10000, 99999)}`,
          dateOfBirth: randomDate(new Date(1998, 0, 1), new Date(2005, 11, 31)),
          address: {
            street: `${randomInt(1, 500)} ${randomItem(['Main St', 'Park Ave', 'Gandhi Nagar', 'MG Road'])}`,
            city: randomItem(['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune']),
            state: randomItem(['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Delhi']),
            zipCode: String(randomInt(100000, 999999)),
            country: 'India'
          }
        },
        academicInfo: {
          course,
          semester: randomInt(1, 8),
          enrollmentDate: randomDate(new Date(2021, 0, 1), new Date(2024, 11, 31)),
          status: Math.random() > 0.1 ? 'active' : randomItem(['inactive', 'graduated'])
        },
        hostelInfo: {
          isHostelResident: Math.random() > 0.4,
          roomNumber: Math.random() > 0.4 ? rooms[randomInt(0, rooms.length - 1)].roomNumber : null
        }
      });
    }
    const createdStudents = await Student.insertMany(students);
    console.log(`🎓 Created ${createdStudents.length} students`);

    // Create admissions
    const admissions = [];
    const statuses = ['pending', 'under_review', 'approved', 'rejected', 'waitlisted'];
    
    for (let i = 0; i < 50; i++) {
      const firstName = randomItem(firstNames);
      const lastName = randomItem(lastNames);
      
      admissions.push({
        applicationId: `APP2024${String(i + 1).padStart(5, '0')}`,
        personalInfo: {
          firstName,
          lastName,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i + 100}@gmail.com`,
          phone: `+91 ${randomInt(70000, 99999)} ${randomInt(10000, 99999)}`,
          dateOfBirth: randomDate(new Date(2000, 0, 1), new Date(2007, 11, 31)),
          gender: randomItem(['male', 'female']),
          address: {
            city: randomItem(['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad']),
            state: randomItem(['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Telangana']),
            country: 'India'
          }
        },
        guardianInfo: {
          name: `${randomItem(firstNames)} ${lastName}`,
          relationship: randomItem(['Father', 'Mother', 'Guardian']),
          phone: `+91 ${randomInt(70000, 99999)} ${randomInt(10000, 99999)}`,
          occupation: randomItem(['Engineer', 'Doctor', 'Teacher', 'Business', 'Government'])
        },
        academicInfo: {
          previousSchool: `${randomItem(['St.', 'Delhi', 'Bangalore', 'Chennai'])} Public School`,
          previousGrade: '12th',
          percentage: randomInt(60, 98),
          appliedCourse: randomItem(courses),
          appliedYear: 2024
        },
        status: randomItem(statuses),
        createdAt: randomDate(new Date(2024, 0, 1), new Date())
      });
    }
    await Admission.insertMany(admissions);
    console.log(`📝 Created ${admissions.length} admission applications`);

    // Create fees
    const fees = [];
    const academicYears = ['2023-24', '2024-25'];
    
    for (const student of createdStudents) {
      const academicYear = randomItem(academicYears);
      const tuitionFee = randomInt(50000, 150000);
      const hostelFee = student.hostelInfo.isHostelResident ? randomInt(30000, 60000) : 0;
      const totalAmount = tuitionFee + hostelFee + 5000 + 3000 + 2000; // library, lab, exam fees
      const paidAmount = Math.random() > 0.3 ? (Math.random() > 0.5 ? totalAmount : randomInt(10000, totalAmount - 10000)) : 0;
      
      fees.push({
        studentId: student._id,
        academicYear,
        semester: student.academicInfo.semester,
        feeStructure: {
          tuitionFee,
          hostelFee,
          libraryFee: 5000,
          labFee: 3000,
          examFee: 2000,
          miscellaneous: 1000
        },
        totalAmount,
        paidAmount,
        pendingAmount: totalAmount - paidAmount,
        dueDate: randomDate(new Date(2024, 0, 1), new Date(2024, 11, 31)),
        status: paidAmount === 0 ? 'pending' : paidAmount >= totalAmount ? 'paid' : 'partial'
      });
    }
    const createdFees = await Fee.insertMany(fees);
    console.log(`💰 Created ${createdFees.length} fee records`);

    // Create payments
    const payments = [];
    const paymentMethods = ['cash', 'card', 'upi', 'netbanking', 'cheque'];
    
    for (const fee of createdFees) {
      if (fee.paidAmount > 0) {
        // Create 1-3 payments for each fee with paid amount
        const numPayments = fee.status === 'paid' ? 1 : randomInt(1, 2);
        let remainingAmount = fee.paidAmount;
        
        for (let i = 0; i < numPayments && remainingAmount > 0; i++) {
          const amount = i === numPayments - 1 ? remainingAmount : randomInt(10000, remainingAmount);
          remainingAmount -= amount;
          
          payments.push({
            receiptNumber: `RCP2024${String(payments.length + 1).padStart(6, '0')}`,
            studentId: fee.studentId,
            feeId: fee._id,
            amount,
            paymentMethod: randomItem(paymentMethods),
            paymentDate: randomDate(new Date(2024, 0, 1), new Date()),
            academicYear: fee.academicYear,
            semester: fee.semester,
            status: 'completed',
            receivedBy: adminUser._id
          });
        }
      }
    }
    await Payment.insertMany(payments);
    console.log(`💳 Created ${payments.length} payment records`);

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📋 Login credentials:');
    console.log('   Admin: admin@erpsystem.com / password123');
    console.log('   Staff: staff@erpsystem.com / password123');
    console.log('   Accountant: accountant@erpsystem.com / password123');
    console.log('   Warden: warden@erpsystem.com / password123');

  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

seed();