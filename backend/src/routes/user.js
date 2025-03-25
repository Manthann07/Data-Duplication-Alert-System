const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const User = require('../models/User');

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile'
    });
  }
});

// Update notification settings
router.post('/notifications', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.notifications = {
      ...user.notifications,
      ...req.body
    };

    await user.save();
    res.json({ message: 'Notification settings updated', notifications: user.notifications });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get notification settings
router.get('/notifications', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.notifications || {
      emailNotifications: true,
      duplicateAlerts: true,
      systemUpdates: true,
      activitySummary: false
    });
  } catch (error) {
    console.error('Error fetching notification settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 