const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');
const { auth } = require('../middleware/auth');
const { Record } = require('../models/Record');

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.xlsx', '.xls', '.csv'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only XLSX, XLS, and CSV files are allowed.'));
    }
  }
});

// Get all records
router.get('/', auth, async (req, res) => {
  try {
    const records = await Record.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      records: records.map(record => ({
        _id: record._id,
        name: record.name,
        fileType: record.fileType,
        size: record.size,
        status: record.status,
        createdAt: record.createdAt,
        description: record.description
      }))
    });
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching records'
    });
  }
});

// Upload new record
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const metadata = JSON.parse(req.body.metadata || '{}');
    const fileStats = fs.statSync(req.file.path);
    const sizeInMB = (fileStats.size / (1024 * 1024)).toFixed(2);

    const record = new Record({
      name: metadata.name || req.file.originalname,
      originalName: req.file.originalname,
      fileType: path.extname(req.file.originalname).toUpperCase().slice(1),
      filePath: req.file.path,
      size: `${sizeInMB} MB`,
      description: metadata.description,
      tags: metadata.tags,
      accessLevel: metadata.accessLevel,
      createdBy: req.user._id,
      status: 'pending'
    });

    await record.save();

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      record: {
        _id: record._id,
        name: record.name,
        fileType: record.fileType,
        size: record.size,
        status: record.status,
        createdAt: record.createdAt
      }
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading file'
    });
  }
});

// Download record
router.get('/:id/download', auth, async (req, res) => {
  try {
    const record = await Record.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found'
      });
    }

    if (!fs.existsSync(record.filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    res.download(record.filePath, record.originalName);
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({
      success: false,
      message: 'Error downloading file'
    });
  }
});

// Get single record
router.get('/:id', auth, async (req, res) => {
  try {
    const record = await Record.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found'
      });
    }

    res.json({
      success: true,
      record: {
        _id: record._id,
        name: record.name,
        fileType: record.fileType,
        size: record.size,
        status: record.status,
        createdAt: record.createdAt,
        description: record.description,
        tags: record.tags,
        accessLevel: record.accessLevel
      }
    });
  } catch (error) {
    console.error('Error fetching record:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching record'
    });
  }
});

module.exports = router; 