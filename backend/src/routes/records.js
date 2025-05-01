const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const { auth } = require('../middleware/auth');
const { Record } = require('../models/Record');
const { logToFile } = require('../../utils/logger');
const { checkForDuplicates } = require('../../utils/duplicateCheck');

/**
 * @typedef {import('express').Request} ExpressRequest
 * @typedef {import('express').Response} ExpressResponse
 * @typedef {import('express').NextFunction} NextFunction
 * @typedef {import('../../utils/duplicateCheck').DuplicateResult} DuplicateResult
 */

/**
 * @typedef {Object} AuthenticatedRequest
 * @property {Object} user
 * @property {string} user._id
 */

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
  if (allowedTypes.includes(file.mimetype) || file.originalname.endsWith('.csv')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only CSV and Excel files are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

/** @type {express.Router} */
const router = express.Router();

// Debug middleware
router.use((req, res, next) => {
  console.log('Request received:', req.method, req.path);
  console.log('Headers:', req.headers);
  next();
});

/**
 * @param {ExpressRequest & AuthenticatedRequest} req
 * @param {ExpressResponse} res
 * @returns {Promise<void>}
 */
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  let newRecord = null;
  try {
    logToFile('=== Starting new upload ===');
    logToFile(`Headers: ${JSON.stringify(req.headers, null, 2)}`);
    
    if (!req.file) {
      logToFile('Error: No file uploaded');
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    logToFile(`File received: ${JSON.stringify(req.file, null, 2)}`);
    logToFile(`User ID: ${req.user?._id}`);

    // Parse metadata
    const metadata = JSON.parse(req.body.metadata || '{}');
    logToFile(`Parsed metadata: ${JSON.stringify(metadata, null, 2)}`);

    const fileStats = fs.statSync(req.file.path);
    const sizeInMB = (fileStats.size / (1024 * 1024)).toFixed(2);
    logToFile(`File size: ${sizeInMB} MB`);

    // Create new record
    newRecord = new Record({
      name: metadata.name || req.file.originalname,
      originalName: req.file.originalname,
      fileType: path.extname(req.file.originalname).toUpperCase().slice(1),
      filePath: req.file.path,
      size: `${sizeInMB}MB`,
      description: metadata.description || '',
      department: metadata.department || 'Unassigned',
      tags: metadata.tags || [],
      accessLevel: metadata.accessLevel || 'private',
      createdBy: req.user._id,
      status: 'pending',
      analysisResult: {
        internalDuplicates: {
          count: 0,
          pairs: new mongoose.Types.DocumentArray([])
        },
        localStorageDuplicates: {
          filesChecked: 0,
          duplicatesFound: new mongoose.Types.DocumentArray([])
        },
        lastAnalyzed: null,
        error: null
      }
    });

    logToFile(`Record to save: ${JSON.stringify(newRecord.toObject(), null, 2)}`);
    
    await newRecord.save();
    logToFile('Record saved successfully to database');

    // Start analysis immediately
    try {
      newRecord.status = 'analyzing';
      await newRecord.save();

      // Analyze internal duplicates
      const fileResult = await checkForDuplicates(req.file.path);
      
      // Update internal duplicates with detailed data
      newRecord.analysisResult.internalDuplicates.pairs = new mongoose.Types.DocumentArray(
        fileResult.duplicates.map(pair => ({
          record1Index: pair.rowNumber1,
          record2Index: pair.rowNumber2,
          similarity: pair.similarity,
          originalData: pair.record1,
          duplicateData: pair.record2
        }))
      );
      newRecord.analysisResult.internalDuplicates.count = fileResult.duplicates.length;

      // Check local storage duplicates
      const existingFiles = await Record.find({ 
        createdBy: req.user._id,
        _id: { $ne: newRecord._id }
      });

      let filesChecked = 0;
      const localDuplicates = new mongoose.Types.DocumentArray([]);

      for (const file of existingFiles) {
        filesChecked++;
        const result = await checkForDuplicates(file.filePath);
        if (result.duplicates.length > 0) {
          localDuplicates.push({
            fileId: file._id,
            fileName: file.name,
            duplicatePairs: new mongoose.Types.DocumentArray(
              result.duplicates.map(pair => ({
                record1Index: pair.rowNumber1,
                record2Index: pair.rowNumber2,
                similarity: pair.similarity,
                originalData: pair.record1,
                duplicateData: pair.record2
              }))
            )
          });
        }
      }

      newRecord.analysisResult.localStorageDuplicates.filesChecked = filesChecked;
      newRecord.analysisResult.localStorageDuplicates.duplicatesFound = localDuplicates;
      newRecord.analysisResult.lastAnalyzed = new Date();
      newRecord.status = 'analyzed';
      await newRecord.save();

      const response = {
        success: true,
        message: 'File uploaded and analyzed successfully',
        record: {
          _id: newRecord._id,
          name: newRecord.name,
          department: newRecord.department,
          fileType: newRecord.fileType,
          size: newRecord.size,
          status: newRecord.status,
          createdAt: newRecord.createdAt,
          analysisResult: newRecord.analysisResult
        }
      };
      
      logToFile(`Sending response: ${JSON.stringify(response, null, 2)}`);
      res.status(201).json(response);
    } catch (error) {
      console.error('Error analyzing file:', error);
      newRecord.status = 'error';
      newRecord.analysisResult.error = error.message;
      await newRecord.save();
      
      logToFile(`Error analyzing file: ${error.message}`);
      logToFile(`Error stack: ${error.stack}`);
      res.status(500).json({
        success: false,
        message: 'Error analyzing file',
        error: error.message
      });
    }
  } catch (error) {
    logToFile(`Error uploading file: ${error.message}`);
    logToFile(`Error stack: ${error.stack}`);
    console.error('Error uploading file:', error);
    
    // Update record status if it exists
    if (newRecord) {
      newRecord.status = 'error';
      if (!newRecord.analysisResult) {
        newRecord.analysisResult = {};
      }
      newRecord.analysisResult.error = error.message;
      await newRecord.save();
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Error uploading file'
    });
  }
});

/**
 * @param {ExpressRequest & AuthenticatedRequest} req
 * @param {ExpressResponse} res
 * @returns {Promise<void>}
 */
router.post('/analyze', auth, upload.single('file'), async (req, res) => {
  let currentRecord = null;
  try {
    logToFile('=== Starting file analysis ===');
    logToFile(`Headers received: ${JSON.stringify(req.headers, null, 2)}`);
    
    if (!req.file) {
      logToFile('No file provided for analysis');
      return res.status(400).json({
        success: false,
        message: 'No file provided for analysis'
      });
    }

    // Find or create record
    currentRecord = await Record.findOne({ 
      filePath: req.file.path,
      createdBy: req.user._id 
    });

    if (!currentRecord) {
      currentRecord = new Record({
        name: req.file.originalname,
        originalName: req.file.originalname,
        fileType: path.extname(req.file.originalname).toUpperCase().slice(1),
        filePath: req.file.path,
        size: `${(req.file.size / (1024 * 1024)).toFixed(2)}MB`,
        createdBy: req.user._id,
        status: 'pending',
        analysisResult: {
          internalDuplicates: {
            count: 0,
            pairs: new mongoose.Types.DocumentArray([])
          },
          localStorageDuplicates: {
            filesChecked: 0,
            duplicatesFound: new mongoose.Types.DocumentArray([])
          },
          lastAnalyzed: null,
          error: null
        }
      });
      await currentRecord.save();
    }

    // Initialize analysis result if it doesn't exist
    if (!currentRecord.analysisResult) {
      currentRecord.analysisResult = {
        internalDuplicates: {
          count: 0,
          pairs: new mongoose.Types.DocumentArray([])
        },
        localStorageDuplicates: {
          filesChecked: 0,
          duplicatesFound: new mongoose.Types.DocumentArray([])
        },
        lastAnalyzed: null,
        error: null
      };
      await currentRecord.save();
    }

    // Update status to analyzing
    currentRecord.status = 'analyzing';
    await currentRecord.save();

    logToFile(`Analyzing file: ${req.file.originalname}`);
    logToFile(`File details: ${JSON.stringify({
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path
    }, null, 2)}`);

    // Analyze internal duplicates
    const fileResult = await checkForDuplicates(req.file.path);
    
    // Update internal duplicates with detailed data
    currentRecord.analysisResult.internalDuplicates.pairs = new mongoose.Types.DocumentArray(
      fileResult.duplicates.map(pair => ({
        record1Index: pair.rowNumber1,
        record2Index: pair.rowNumber2,
        similarity: pair.similarity,
        originalData: pair.record1,
        duplicateData: pair.record2
      }))
    );
    currentRecord.analysisResult.internalDuplicates.count = fileResult.duplicates.length;

    // Check local storage duplicates
    const existingFiles = await Record.find({ 
      createdBy: req.user._id,
      _id: { $ne: currentRecord._id }  // Exclude current file
    });

    let filesChecked = 0;
    const localDuplicates = new mongoose.Types.DocumentArray([]);

    for (const file of existingFiles) {
      filesChecked++;
      const result = await checkForDuplicates(file.filePath);
      if (result.duplicates.length > 0) {
        localDuplicates.push({
          fileId: file._id,
          fileName: file.name,
          duplicatePairs: new mongoose.Types.DocumentArray(
            result.duplicates.map(pair => ({
              record1Index: pair.rowNumber1,
              record2Index: pair.rowNumber2,
              similarity: pair.similarity,
              originalData: pair.record1,
              duplicateData: pair.record2
            }))
          )
        });
      }
    }

    currentRecord.analysisResult.localStorageDuplicates.filesChecked = filesChecked;
    currentRecord.analysisResult.localStorageDuplicates.duplicatesFound = localDuplicates;
    currentRecord.analysisResult.lastAnalyzed = new Date();
    currentRecord.status = 'analyzed';
    await currentRecord.save();

    // Set headers to prevent caching
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    res.json({
      success: true,
      recordId: currentRecord._id,
      status: currentRecord.status,
      analysisResult: currentRecord.analysisResult
    });

  } catch (error) {
    logToFile(`Error analyzing file: ${error.message}`);
    logToFile(`Error stack: ${error.stack}`);
    console.error('Error analyzing file:', error);

    // Update record status if it exists
    if (currentRecord) {
      currentRecord.status = 'error';
      currentRecord.analysisResult.error = error.message;
      await currentRecord.save();
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Error analyzing file'
    });
  }
});

/**
 * @param {ExpressRequest & AuthenticatedRequest} req
 * @param {ExpressResponse} res
 * @returns {Promise<void>}
 */
router.get('/analysis-status/:recordId', auth, async (req, res) => {
  try {
    const existingRecord = await Record.findOne({
      _id: req.params.recordId,
      createdBy: req.user._id
    });

    if (!existingRecord) {
      return res.status(404).json({
        success: false,
        message: 'Record not found'
      });
    }

    res.json({
      success: true,
      status: existingRecord.status,
      analysisResult: existingRecord.analysisResult
    });

  } catch (error) {
    console.error('Error getting analysis status:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error getting analysis status'
    });
  }
});

/**
 * @param {ExpressRequest & AuthenticatedRequest} req
 * @param {ExpressResponse} res
 * @returns {Promise<void>}
 */
router.get('/', auth, async (req, res) => {
  try {
    const records = await Record.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 })
      .select('name originalName fileType size createdAt status analysisResult department');

    // Format records for frontend display
    const formattedRecords = records.map(record => ({
      id: record._id,
      name: record.name,
      department: record.department || 'Unassigned',
      size: record.size,
      date: record.createdAt.toISOString().split('T')[0],
      status: record.analysisResult?.lastAnalyzed ? 'Active' : 'Pending',
      actions: 'View'
    }));

    res.json({
      success: true,
      records: formattedRecords
    });
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching records'
    });
  }
});

/**
 * @param {ExpressRequest & AuthenticatedRequest} req
 * @param {ExpressResponse} res
 * @returns {Promise<void>}
 */
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

/**
 * @param {ExpressRequest & AuthenticatedRequest} req
 * @param {ExpressResponse} res
 * @returns {Promise<void>}
 */
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