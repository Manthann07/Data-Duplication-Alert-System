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
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || typeof decoded !== 'object') {
      throw new Error('Invalid token');
    }

    const user = await User.findOne({ _id: decoded._id });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

module.exports = { auth }; 