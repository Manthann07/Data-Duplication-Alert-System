const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  getMe, 
  changePassword, 
  verifyEmail, 
  resendVerificationEmail,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');
const { auth } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes (require authentication)
router.get('/me', auth, getMe);
router.post('/change-password', auth, changePassword);

module.exports = router;
