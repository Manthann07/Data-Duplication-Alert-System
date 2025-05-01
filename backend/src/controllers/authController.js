const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const emailService = require('../../utils/emailService');
const crypto = require('crypto');

exports.register = async (req, res) => {
  try {
    console.log('Register request received:', req.body);
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      isEmailVerified: true // Set email as verified by default
    });

    await user.save();
    console.log('User created successfully:', user._id);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering user'
    });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    console.log('Verify email request received:', req.query);
    const { token } = req.query;

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      console.log('Invalid or expired verification token');
      return res.status(400).json({ success: false, message: 'Invalid or expired verification token' });
    }

    user.isEmailVerified = true;
    // @ts-ignore
    user.emailVerificationToken = undefined;
    // @ts-ignore
    user.emailVerificationExpires = undefined;
    await user.save();
    console.log('Email verified successfully for user:', user._id);

    res.status(200).json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ success: false, message: 'Error verifying email' });
  }
};

const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not set in environment variables');
  }
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

exports.login = async (req, res) => {
  try {
    console.log('Login attempt - Raw request body:', req.body);
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      console.log('Missing credentials - Email:', !!email, 'Password:', !!password);
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check if user exists and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    console.log('User lookup result:', user ? 'Found' : 'Not found', 'Email:', email);
    
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    console.log('User found:', user._id, 'Email verified:', user.isEmailVerified);

    // Check if email is verified
    if (!user.isEmailVerified) {
      console.log('Email not verified for user:', user._id);
      return res.status(401).json({
        success: false,
        message: 'Please verify your email before logging in'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password comparison result:', isMatch);
    
    if (!isMatch) {
      console.log('Invalid password for user:', user._id);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login time
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Remove sensitive data
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      isEmailVerified: user.isEmailVerified
    };

    // Store user data in session
    console.log('Login successful - Sending response:', {
      success: true,
      user: { ...userResponse, id: userResponse.id.toString() }
    });
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    console.log('Get me request received:', req.user._id);
    
    // User is already attached to req by auth middleware
    const user = req.user;
    
    console.log('User profile fetched successfully:', user._id);
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: 'Error fetching profile' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    console.log('Change password request received:', req.user.id);
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      console.log('Invalid current password for user:', req.user.id);
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    console.log('Password updated successfully for user:', user._id);

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Error changing password' });
  }
};

exports.resendVerificationEmail = async (req, res) => {
  try {
    console.log('Resend verification email request received:', req.body);
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.isEmailVerified) {
      console.log('Invalid request for user:', email);
      return res.status(400).json({ success: false, message: 'Invalid request' });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // @ts-ignore
    user.emailVerificationToken = verificationToken;
    // @ts-ignore
    user.emailVerificationExpires = verificationExpires;
    await user.save();
    console.log('Verification email resent for user:', user._id);

    if (!(await emailService.sendVerificationEmail(email, verificationToken))) {
      console.log('Error sending verification email:', email);
      return res.status(500).json({ success: false, message: 'Error sending verification email' });
    }

    res.status(200).json({ success: true, message: 'Verification email sent' });
  } catch (error) {
    console.error('Resend verification email error:', error);
    res.status(500).json({ success: false, message: 'Error resending verification email' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    console.log('Forgot password request received:', req.body);
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    console.log('User search result:', user ? 'Found' : 'Not found');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with that email'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    // Save reset token and expiry to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetExpires;
    await user.save();
    console.log('Reset token generated for user:', user._id);

    // Send password reset email
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    try {
      await emailService.sendPasswordResetEmail(email, resetLink);
      console.log('Reset email sent successfully to:', email);
      
      res.status(200).json({
        success: true,
        message: 'Password reset instructions sent to your email'
      });
    } catch (emailError) {
      console.error('Error sending reset email:', emailError);
      
      // Reset the token since email failed
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      
      throw new Error('Failed to send reset email');
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error processing forgot password request'
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    console.log('Reset password request received');
    const { token, newPassword } = req.body;

    // Validate input
    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required'
      });
    }

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      console.log('Invalid or expired reset token');
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    console.log('Valid reset token found for user:', user._id);

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log('Password reset successful for user:', user._id);

    // Generate new auth token
    const authToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      message: 'Password reset successful',
      token: authToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting password'
    });
  }
};
