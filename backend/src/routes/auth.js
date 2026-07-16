const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticate, generateTokens, asyncHandler } = require('../middleware/auth');

// Input validation helper
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePassword = (password) => {
  // Minimum 8 characters, at least one letter and one number
  const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
  return re.test(password);
};

// Register new user
router.post('/register', asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, role, phone } = req.body;

  // Input validation
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: 'Email, password, firstName, and lastName are required' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({ error: 'Password must be at least 8 characters with at least one letter and one number' });
  }

  if (firstName.length < 2 || lastName.length < 2) {
    return res.status(400).json({ error: 'First name and last name must be at least 2 characters' });
  }

  // Validate role if provided
  if (role && !['admin', 'staff', 'accountant', 'hostel_warden'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  // Check if user exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return res.status(400).json({ error: 'Email already registered' });
  }

  // Create user
  const user = new User({
    email: email.toLowerCase(),
    password,
    firstName,
    lastName,
    role: role || 'staff',
    phone
  });

  await user.save();

  const { accessToken, refreshToken } = generateTokens(user._id);
  user.refreshToken = refreshToken;
  await user.save();

  res.status(201).json({
    message: 'User registered successfully',
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    },
    accessToken,
    refreshToken
  });
}));

// Login
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Input validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Find user
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Check if active
  if (!user.isActive) {
    return res.status(401).json({ error: 'Account is deactivated' });
  }

  // Update last login
  user.lastLogin = new Date();
  const { accessToken, refreshToken } = generateTokens(user._id);
  user.refreshToken = refreshToken;
  await user.save();

  res.json({
    message: 'Login successful',
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    },
    accessToken,
    refreshToken
  });
}));

// Refresh token
router.post('/refresh', asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token required' });
  }

  const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
  const user = await User.findById(decoded.userId);

  if (!user || user.refreshToken !== refreshToken) {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }

  const tokens = generateTokens(user._id);
  user.refreshToken = tokens.refreshToken;
  await user.save();

  res.json(tokens);
}));

// Logout
router.post('/logout', authenticate, asyncHandler(async (req, res) => {
  req.user.refreshToken = null;
  await req.user.save();
  res.json({ message: 'Logged out successfully' });
}));

// Get current user
router.get('/me', authenticate, asyncHandler(async (req, res) => {
  res.json({ 
    user: {
      id: req.user._id,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      role: req.user.role,
      phone: req.user.phone,
      avatar: req.user.avatar
    }
  });
}));

// Update profile
router.put('/profile', authenticate, asyncHandler(async (req, res) => {
  const { firstName, lastName, phone } = req.body;
  
  // Input validation
  if (firstName && firstName.length < 2) {
    return res.status(400).json({ error: 'First name must be at least 2 characters' });
  }
  
  if (lastName && lastName.length < 2) {
    return res.status(400).json({ error: 'Last name must be at least 2 characters' });
  }
  
  if (phone && phone.length < 10) {
    return res.status(400).json({ error: 'Invalid phone number' });
  }
  
  req.user.firstName = firstName || req.user.firstName;
  req.user.lastName = lastName || req.user.lastName;
  req.user.phone = phone || req.user.phone;
  
  await req.user.save();
  res.json({ message: 'Profile updated', user: req.user });
}));

// Change password
router.put('/change-password', authenticate, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Input validation
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current password and new password are required' });
  }

  if (!validatePassword(newPassword)) {
    return res.status(400).json({ error: 'Password must be at least 8 characters with at least one letter and one number' });
  }

  const isMatch = await req.user.comparePassword(currentPassword);
  if (!isMatch) {
    return res.status(400).json({ error: 'Current password is incorrect' });
  }

  // Don't allow password to be same as current
  if (currentPassword === newPassword) {
    return res.status(400).json({ error: 'New password must be different from current password' });
  }

  req.user.password = newPassword;
  await req.user.save();

  res.json({ message: 'Password changed successfully' });
}));

// Google OAuth Sign-In
router.post('/google', asyncHandler(async (req, res) => {
  const { credential, userData } = req.body;

  // Input validation
  if (!credential || !userData || !userData.email) {
    return res.status(400).json({ error: 'Missing credential or user data' });
  }

  // Check if user exists with this email
  let user = await User.findOne({ email: userData.email.toLowerCase() });

  if (user) {
    // Update existing user's Google info
    user.googleId = userData.id;
    user.firstName = userData.firstName || user.firstName;
    user.lastName = userData.lastName || user.lastName;
    user.avatar = userData.picture || user.avatar;
    user.lastLogin = new Date();
    
    // Ensure authProvider is set
    if (!user.authProvider) {
      user.authProvider = 'google';
    }
  } else {
    // Create new user from Google data
    user = new User({
      email: userData.email.toLowerCase(),
      googleId: userData.id,
      firstName: userData.firstName || userData.name?.split(' ')[0] || 'User',
      lastName: userData.lastName || userData.name?.split(' ').slice(1).join(' ') || '',
      avatar: userData.picture,
      role: 'staff', // Default role for Google sign-in users
      isActive: true,
      emailVerified: true,
      authProvider: 'google',
      lastLogin: new Date()
    });
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user._id);
  user.refreshToken = refreshToken;
  await user.save();

  res.json({
    message: 'Google sign-in successful',
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      avatar: user.avatar
    },
    accessToken,
    refreshToken
  });
}));

module.exports = router;
