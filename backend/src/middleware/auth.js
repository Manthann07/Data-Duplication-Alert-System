// @ts-nocheck
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * @typedef {import('express').Request} ExpressRequest
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 * 
 * @typedef {Object} AuthRequest
 * @property {string} token
 * @property {import('../models/User').User} user
 * 
 * @typedef {ExpressRequest & AuthRequest} Request
 */

/**
 * Authentication middleware
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 */
const auth = async (req, res, next) => {
  try {
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not set in environment variables');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error'
      });
    }

    // Get token from Authorization header
    const authHeader = req.header('Authorization');
    console.log('Auth header:', authHeader);

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token provided'
      });
    }

    // Check if it's a Bearer token
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format'
      });
    }

    // Extract the token
    const token = authHeader.split(' ')[1];
    console.log('Token being verified:', token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token found in Authorization header'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    if (!decoded.userId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token: missing user ID'
      });
    }

    // Find user in database
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Add user and userId to request
    req.user = user;
    req.userId = user._id.toString(); // Add userId as string
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication token'
    });
  }
};

module.exports = { auth };