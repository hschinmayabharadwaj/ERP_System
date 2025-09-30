-- Seed data for ERP System
-- This file contains sample data for development and testing

-- Insert sample courses
INSERT INTO courses (id, name, duration_years, fee_per_semester) VALUES
(UUID(), 'Computer Science', 4, 25000),
(UUID(), 'Business Administration', 3, 20000),
(UUID(), 'Engineering', 4, 30000),
(UUID(), 'Medicine', 6, 50000),
(UUID(), 'Arts', 3, 15000);

-- Insert sample hostel rooms
INSERT INTO hostel_rooms (id, room_number, floor, capacity, room_type, monthly_fee, facilities) VALUES
(UUID(), 'A101', 1, 1, 'single', 8000, '{"ac": true, "wifi": true, "study_table": true, "wardrobe": true}'),
(UUID(), 'A102', 1, 2, 'double', 6000, '{"ac": false, "wifi": true, "study_table": true, "wardrobe": true}'),
(UUID(), 'A201', 2, 1, 'single', 8500, '{"ac": true, "wifi": true, "study_table": true, "wardrobe": true}'),
(UUID(), 'A202', 2, 2, 'double', 6500, '{"ac": false, "wifi": true, "study_table": true, "wardrobe": true}'),
(UUID(), 'B101', 1, 3, 'triple', 4500, '{"ac": false, "wifi": true, "study_table": true, "wardrobe": true}'),
(UUID(), 'B102', 1, 3, 'triple', 4500, '{"ac": false, "wifi": true, "study_table": true, "wardrobe": true}'),
(UUID(), 'B201', 2, 4, 'shared', 3500, '{"ac": false, "wifi": true, "study_table": true, "wardrobe": false}'),
(UUID(), 'B202', 2, 4, 'shared', 3500, '{"ac": false, "wifi": true, "study_table": true, "wardrobe": false}');

-- Insert admin user
INSERT INTO users (id, username, email, password_hash, role) VALUES
(UUID(), 'admin', 'admin@erpsystem.com', '$2a$10$example_hash_replace_with_actual', 'admin');

-- Insert sample students
SET @student1_id = UUID();
SET @student2_id = UUID();
SET @student3_id = UUID();
SET @student4_id = UUID();
SET @student5_id = UUID();

INSERT INTO students (id, student_id, first_name, last_name, email, phone, date_of_birth, course, semester) VALUES
(@student1_id, 'STU001', 'John', 'Doe', 'john.doe@email.com', '+1234567890', '2002-05-15', 'Computer Science', 3),
(@student2_id, 'STU002', 'Jane', 'Smith', 'jane.smith@email.com', '+1234567891', '2003-03-22', 'Business Administration', 2),
(@student3_id, 'STU003', 'Mike', 'Johnson', 'mike.johnson@email.com', '+1234567892', '2002-11-08', 'Engineering', 4),
(@student4_id, 'STU004', 'Sarah', 'Wilson', 'sarah.wilson@email.com', '+1234567893', '2003-07-14', 'Medicine', 1),
(@student5_id, 'STU005', 'David', 'Brown', 'david.brown@email.com', '+1234567894', '2002-09-30', 'Arts', 3);

-- Insert student addresses
INSERT INTO student_addresses (id, student_id, street, city, state, zip_code, country) VALUES
(UUID(), @student1_id, '123 Main St', 'New York', 'NY', '10001', 'USA'),
(UUID(), @student2_id, '456 Oak Ave', 'Los Angeles', 'CA', '90210', 'USA'),
(UUID(), @student3_id, '789 Pine Rd', 'Chicago', 'IL', '60601', 'USA'),
(UUID(), @student4_id, '321 Elm St', 'Houston', 'TX', '77001', 'USA'),
(UUID(), @student5_id, '654 Maple Dr', 'Phoenix', 'AZ', '85001', 'USA');

-- Insert sample fees
SET @fee1_id = UUID();
SET @fee2_id = UUID();
SET @fee3_id = UUID();
SET @fee4_id = UUID();
SET @fee5_id = UUID();

INSERT INTO fees (id, student_id, academic_year, semester, tuition_fee, hostel_fee, library_fee, lab_fee, exam_fee, miscellaneous, total_amount, paid_amount, pending_amount, due_date, status) VALUES
(@fee1_id, @student1_id, '2024-25', 1, 25000, 8000, 1000, 2000, 1500, 500, 38000, 38000, 0, '2024-07-31', 'paid'),
(@fee2_id, @student2_id, '2024-25', 1, 20000, 6000, 1000, 0, 1500, 500, 29000, 15000, 14000, '2024-07-31', 'partial'),
(@fee3_id, @student3_id, '2024-25', 1, 30000, 0, 1000, 3000, 1500, 500, 36000, 0, 36000, '2024-07-31', 'pending'),
(@fee4_id, @student4_id, '2024-25', 1, 50000, 8500, 1000, 5000, 2000, 1000, 67500, 67500, 0, '2024-07-31', 'paid'),
(@fee5_id, @student5_id, '2024-25', 1, 15000, 4500, 1000, 500, 1000, 500, 22500, 10000, 12500, '2024-07-31', 'partial');

-- Insert sample payments
INSERT INTO payments (id, fee_id, amount, payment_method, transaction_id, receipt_number, payment_date, remarks) VALUES
(UUID(), @fee1_id, 38000, 'online', 'TXN001', 'RCP001', '2024-07-15 10:30:00', 'Full payment via credit card'),
(UUID(), @fee2_id, 15000, 'bank_transfer', 'TXN002', 'RCP002', '2024-07-20 14:15:00', 'Partial payment via bank transfer'),
(UUID(), @fee4_id, 67500, 'online', 'TXN003', 'RCP003', '2024-07-10 09:45:00', 'Full payment via debit card'),
(UUID(), @fee5_id, 10000, 'cash', NULL, 'RCP004', '2024-07-25 11:20:00', 'Partial payment in cash');

-- Insert sample hostel bookings
INSERT INTO hostel_bookings (id, student_id, room_id, check_in_date, status) VALUES
(UUID(), @student1_id, (SELECT id FROM hostel_rooms WHERE room_number = 'A101'), '2024-07-01', 'active'),
(UUID(), @student2_id, (SELECT id FROM hostel_rooms WHERE room_number = 'A102'), '2024-07-01', 'active'),
(UUID(), @student4_id, (SELECT id FROM hostel_rooms WHERE room_number = 'A201'), '2024-07-01', 'active'),
(UUID(), @student5_id, (SELECT id FROM hostel_rooms WHERE room_number = 'B101'), '2024-07-01', 'active');

-- Update room occupancy
UPDATE hostel_rooms SET current_occupancy = 1 WHERE room_number IN ('A101', 'A201');
UPDATE hostel_rooms SET current_occupancy = 1 WHERE room_number = 'A102';
UPDATE hostel_rooms SET current_occupancy = 1 WHERE room_number = 'B101';

-- Insert sample documents
INSERT INTO documents (id, student_id, document_type, filename, file_path, file_size, mime_type) VALUES
(UUID(), @student1_id, 'ID_PROOF', 'john_doe_id.pdf', '/uploads/documents/john_doe_id.pdf', 256000, 'application/pdf'),
(UUID(), @student1_id, 'ACADEMIC_CERTIFICATE', 'john_doe_certificate.pdf', '/uploads/documents/john_doe_certificate.pdf', 512000, 'application/pdf'),
(UUID(), @student2_id, 'ID_PROOF', 'jane_smith_id.pdf', '/uploads/documents/jane_smith_id.pdf', 245000, 'application/pdf'),
(UUID(), @student3_id, 'ID_PROOF', 'mike_johnson_id.pdf', '/uploads/documents/mike_johnson_id.pdf', 267000, 'application/pdf'),
(UUID(), @student4_id, 'ID_PROOF', 'sarah_wilson_id.pdf', '/uploads/documents/sarah_wilson_id.pdf', 234000, 'application/pdf'),
(UUID(), @student5_id, 'ID_PROOF', 'david_brown_id.pdf', '/uploads/documents/david_brown_id.pdf', 289000, 'application/pdf');