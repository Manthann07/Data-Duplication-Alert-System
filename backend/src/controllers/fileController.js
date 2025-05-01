const path = require('path');
const fs = require('fs').promises;
const File = require('../models/File');
const DownloadHistory = require('../models/DownloadHistory');
const { checkForDuplicates } = require('../../utils/duplicateCheck');
const { parse } = require('csv-parse');
const { stringify } = require('csv-stringify');
const XLSX = require('xlsx');

/**
 * @typedef {import('../../utils/duplicateCheck').DuplicateResult} DuplicateResult
 */

// Helper function to check if file/directory exists
const checkExists = async (path) => {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
};

// Helper function to create directory if it doesn't exist
const createDirectoryIfNotExists = async (dirPath) => {
  try {
    const exists = await checkExists(dirPath);
    if (!exists) {
      await fs.mkdir(dirPath, { recursive: true });
      console.log('Created directory:', dirPath);
    }
    return true;
  } catch (error) {
    console.error('Error creating directory:', error);
    return false;
  }
};

// Upload file
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    console.log('File upload request received:', {
      filename: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      tempPath: req.file.path
    });

    // Get the authenticated user's ID from the request
    if (!req.userId) {
      console.error('Authentication error: No userId in request');
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }
    console.log('User ID from request:', req.userId);

    // Ensure uploads directory exists
    const uploadsDir = path.join(__dirname, '../../uploads');
    console.log('Ensuring uploads directory exists:', uploadsDir);
    await fs.mkdir(uploadsDir, { recursive: true });

    // Move file from temp to permanent location
    const fileExtension = path.extname(req.file.originalname);
    const timestamp = Date.now();
    const randomString = Math.round(Math.random() * 1E9);
    const filename = `${timestamp}-${randomString}-${req.file.originalname}`;
    const permanentPath = path.join(uploadsDir, filename);

    await fs.rename(req.file.path, permanentPath);
    console.log('File moved to permanent location:', permanentPath);

    // Create file record in database
    const file = new File({
      userId: req.userId,
      filename: req.file.originalname,
      path: permanentPath,
      size: req.file.size,
      mimetype: req.file.mimetype,
      department: req.body.department || 'General',
      description: req.body.description || '',
      tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : []
    });

    console.log('Attempting to save file record:', {
      userId: file.userId,
      filename: file.filename,
      department: file.department
    });

    await file.save();
    console.log('File record saved successfully');

    // Check for duplicates
    const duplicates = await checkForDuplicates(file.path);

    return res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      file: {
        id: file._id,
        filename: file.filename,
        size: file.size,
        uploadDate: file.uploadDate,
        department: file.department,
        description: file.description,
        tags: file.tags
      },
      duplicates: duplicates
    });
  } catch (error) {
    console.error('Error in file upload:', error);

    // Clean up temp file if it exists
    if (req.file && req.file.path) {
      try {
        await fs.unlink(req.file.path);
        console.log('Cleaned up temporary file:', req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting temp file:', unlinkError);
      }
    }

    return res.status(500).json({
      success: false,
      message: 'Error uploading file',
      error: error.message
    });
  }
};

// Check for duplicates
const checkForDuplicatesHandler = async (req, res) => {
  console.log('Starting duplicate check process');
  console.log('Request params:', req.params);
  console.log('Request user:', req.userId);
  console.log('Request headers:', req.headers);
  
  try {
    let filePath;
    let originalData = null;
    
    // If a file ID is provided in the URL
    if (req.params.id) {
      console.log('Checking duplicates for existing file:', req.params.id);
      console.log('User ID from request:', req.userId);
      
      // Find file and verify ownership
      const file = await File.findOne({ 
        _id: req.params.id,
        userId: req.userId // Ensure the file belongs to the authenticated user
      });
      
      console.log('Found file:', file);
      
      if (!file) {
        console.log('File not found or access denied');
        return res.status(404).json({
          success: false,
          message: 'File not found or access denied'
        });
      }

      // Check if file exists on disk
      try {
        await fs.access(file.path);
        console.log('File exists on disk:', file.path);
      } catch (error) {
        console.error('File not found on disk:', error);
        return res.status(404).json({
          success: false,
          message: 'File data not found on server'
        });
      }

      filePath = file.path;
      originalData = {
        filename: file.filename,
        department: file.department,
        description: file.description,
        uploadDate: file.uploadDate,
        size: file.size
      };

      console.log('Original data prepared:', originalData);
    } else {
      console.log('No file ID provided');
      return res.status(400).json({
        success: false,
        message: 'No file ID provided'
      });
    }

    console.log('Analyzing file for duplicates:', {
      path: filePath
    });

    /** @type {DuplicateResult} */
    const results = await checkForDuplicates(filePath);
    
    console.log('Duplicate check completed:', {
      hasDuplicates: results.hasDuplicates,
      totalRecords: results.totalRecords,
      duplicatePairs: results.duplicates?.length || 0
    });

    const response = {
      success: true,
      hasDuplicates: results.hasDuplicates,
      totalRecords: results.totalRecords,
      originalData: originalData,
      duplicates: results.duplicates || []
    };

    console.log('Sending response:', response);
    res.json(response);
  } catch (error) {
    console.error('Error checking duplicates:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking for duplicates',
      error: error.message
    });
  }
};

// List all files
const listFiles = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const files = await File.find({ userId: userId }).sort({ uploadDate: -1 });
    
    res.json({
      success: true,
      files: files.map(file => ({
        id: file._id,
        filename: file.filename,
        size: file.size,
        uploadDate: file.uploadDate,
        department: file.department,
        description: file.description,
        tags: file.tags
      }))
    });
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving files',
      error: error.message
    });
  }
};

// Get file by ID
const getFileById = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const file = await File.findOne({ _id: req.params.id, userId: userId });
    
    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    res.json({
      success: true,
      file: {
        id: file._id,
        filename: file.filename,
        size: file.size,
        uploadDate: file.uploadDate,
        department: file.department,
        description: file.description,
        tags: file.tags
      }
    });
  } catch (error) {
    console.error('Error getting file:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving file',
      error: error.message
    });
  }
};

// Download file
const downloadFile = async (req, res) => {
  try {
    const { id, format = 'csv' } = req.params;
    const userId = req.user.id || req.user._id;

    // Get the file from database and verify ownership
    const file = await File.findOne({ _id: id, userId: userId });
    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found or access denied"
      });
    }

    // Read the file content
    const fileContent = await fs.readFile(file.path, 'utf-8');
    let records = [];
    
    // Parse the file content based on its format
    if (file.filename.toLowerCase().endsWith('.csv')) {
      records = await new Promise((resolve, reject) => {
        parse(fileContent, {
          columns: true,
          skip_empty_lines: true
        }, (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      });
    } else if (file.filename.toLowerCase().endsWith('.xlsx') || file.filename.toLowerCase().endsWith('.xls')) {
      const workbook = XLSX.readFile(file.path);
      const sheetName = workbook.SheetNames[0];
      records = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    } else if (file.filename.toLowerCase().endsWith('.json')) {
      records = JSON.parse(fileContent);
    } else {
      return res.status(400).json({
        success: false,
        message: "Unsupported file type"
      });
    }

    // Convert to requested format
    let outputContent;
    let contentType;
    let extension;

    switch (format.toLowerCase()) {
      case 'csv':
        outputContent = await new Promise((resolve, reject) => {
          stringify(records, {
            header: true,
            columns: Object.keys(records[0] || {})
          }, (err, output) => {
            if (err) reject(err);
            else resolve(output);
          });
        });
        contentType = 'text/csv';
        extension = 'csv';
        break;

      case 'xlsx':
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(records);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        
        // Create temp directory if it doesn't exist
        const tempDir = path.join(__dirname, '../../uploads/temp');
        await fs.mkdir(tempDir, { recursive: true });
        
        const tempPath = path.join(tempDir, `${Date.now()}.xlsx`);
        XLSX.writeFile(workbook, tempPath);
        outputContent = await fs.readFile(tempPath);
        await fs.unlink(tempPath);
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        extension = 'xlsx';
        break;

      case 'json':
        outputContent = JSON.stringify(records, null, 2);
        contentType = 'application/json';
        extension = 'json';
        break;

      default:
        return res.status(400).json({
          success: false,
          message: "Unsupported format requested"
        });
    }

    // Set response headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename=processed_file.${extension}`);

    // Send the file
    res.send(outputContent);
  } catch (error) {
    console.error('Error in downloadFile:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Error downloading file",
        error: error.message
      });
    }
  }
};

// Delete file
const deleteFile = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const file = await File.findOne({ _id: req.params.id, userId: userId });
    
    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Delete file from filesystem
    try {
      await fs.unlink(file.path);
    } catch (unlinkError) {
      console.error('Error deleting file from filesystem:', unlinkError);
    }

    // Delete file record from database
    await file.deleteOne();

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting file',
      error: error.message
    });
  }
};

// Merge duplicate records
const mergeDuplicateRecords = async (req, res) => {
  try {
    const { id } = req.params;
    const { group } = req.body;
    const userId = req.user.id || req.user._id;

    if (!group || !group.record1 || !group.record2) {
      return res.status(400).json({
        success: false,
        message: "Missing required record data for merging"
      });
    }

    // Get the file from database and verify ownership
    const file = await File.findOne({ _id: id, userId: userId });
    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found or access denied"
      });
    }

    // Read the file content
    const fileContent = await fs.readFile(file.path, 'utf-8');
    let records = [];
    
    // Parse the file content based on file type
    const fileExt = file.filename.toLowerCase().split('.').pop();
    
    if (fileExt === 'csv') {
      records = await new Promise((resolve, reject) => {
        parse(fileContent, { columns: true }, (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      });
    } else if (fileExt === 'json') {
      records = JSON.parse(fileContent);
    } else if (fileExt === 'xlsx' || fileExt === 'xls') {
      const workbook = XLSX.readFile(file.path);
      const sheetName = workbook.SheetNames[0];
      records = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    } else {
      return res.status(400).json({
        success: false,
        message: "Unsupported file type for merging"
      });
    }

    // Find and merge the duplicate records
    const record1Index = group.rowNumber1 - 1; // Convert from 1-based to 0-based index
    const record2Index = group.rowNumber2 - 1; // Convert from 1-based to 0-based index

    if (record1Index < 0 || record2Index < 0 || record1Index >= records.length || record2Index >= records.length) {
      return res.status(404).json({
        success: false,
        message: "One or both records not found in the file"
      });
    }

    // Merge logic: Keep the most complete/recent data
    const mergedRecord = {};
    const keys = [...new Set([...Object.keys(group.record1), ...Object.keys(group.record2)])];
    
    keys.forEach(key => {
      // Skip internal fields
      if (['_id', '__v', 'createdAt', 'updatedAt'].includes(key)) return;
      
      // Prefer non-empty values from record1, fallback to record2
      mergedRecord[key] = group.record1[key] || group.record2[key];
    });

    // Replace record1 with merged data and remove record2
    records[record1Index] = { ...mergedRecord, rowNumber: group.rowNumber1 };
    records.splice(record2Index, 1);

    // Create a backup of the original file
    const backupPath = `${file.path}.backup`;
    await fs.copyFile(file.path, backupPath);

    try {
      // Write back to file based on file type
      if (fileExt === 'csv') {
        const outputContent = await new Promise((resolve, reject) => {
          stringify(records, { header: true }, (err, output) => {
            if (err) reject(err);
            else resolve(output);
          });
        });
        await fs.writeFile(file.path, outputContent);
      } else if (fileExt === 'json') {
        await fs.writeFile(file.path, JSON.stringify(records, null, 2));
      } else if (fileExt === 'xlsx' || fileExt === 'xls') {
        const newWorkbook = XLSX.utils.book_new();
        const newSheet = XLSX.utils.json_to_sheet(records);
        XLSX.utils.book_append_sheet(newWorkbook, newSheet, 'Sheet1');
        XLSX.writeFile(newWorkbook, file.path);
      }

      // Update file metadata
      file.updatedAt = new Date();
      file.size = (await fs.stat(file.path)).size;
      await file.save();

      // Remove backup if everything succeeded
      await fs.unlink(backupPath);

      console.log('Successfully merged records:', {
        fileId: id,
        rowNumbers: [group.rowNumber1, group.rowNumber2]
      });

      return res.json({
        success: true,
        message: "Records merged successfully",
        mergedRecord
      });
    } catch (error) {
      // Restore from backup if write failed
      await fs.copyFile(backupPath, file.path);
      await fs.unlink(backupPath);
      throw error;
    }
  } catch (error) {
    console.error('Error merging records:', error);
    return res.status(500).json({
      success: false,
      message: "Error merging records",
      error: error.message
    });
  }
};

// Keep both records
const keepBothRecords = async (req, res) => {
  try {
    const { id } = req.params;
    const { group } = req.body;
    const userId = req.user.id || req.user._id;

    if (!group || !group.record1 || !group.record2) {
      return res.status(400).json({
        success: false,
        message: "Missing required record data"
      });
    }

    // Get the file from database and verify ownership
    const file = await File.findOne({ _id: id, userId: userId });
    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found or access denied"
      });
    }

    // Read the file content
    const fileContent = await fs.readFile(file.path, 'utf-8');
    let records = [];
    
    // Parse the file content based on file type
    const fileExt = file.filename.toLowerCase().split('.').pop();
    
    if (fileExt === 'csv') {
      records = await new Promise((resolve, reject) => {
        parse(fileContent, { columns: true }, (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      });
    } else if (fileExt === 'json') {
      records = JSON.parse(fileContent);
    } else if (fileExt === 'xlsx' || fileExt === 'xls') {
      const workbook = XLSX.readFile(file.path);
      const sheetName = workbook.SheetNames[0];
      records = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    } else {
      return res.status(400).json({
        success: false,
        message: "Unsupported file type"
      });
    }

    // Create a backup of the original file
    const backupPath = `${file.path}.backup`;
    await fs.copyFile(file.path, backupPath);

    try {
      // Write back to file based on file type
      if (fileExt === 'csv') {
        const outputContent = await new Promise((resolve, reject) => {
          stringify(records, { header: true }, (err, output) => {
            if (err) reject(err);
            else resolve(output);
          });
        });
        await fs.writeFile(file.path, outputContent);
      } else if (fileExt === 'json') {
        await fs.writeFile(file.path, JSON.stringify(records, null, 2));
      } else if (fileExt === 'xlsx' || fileExt === 'xls') {
        const newWorkbook = XLSX.utils.book_new();
        const newSheet = XLSX.utils.json_to_sheet(records);
        XLSX.utils.book_append_sheet(newWorkbook, newSheet, 'Sheet1');
        XLSX.writeFile(newWorkbook, file.path);
      }

      // Update file metadata
      file.updatedAt = new Date();
      file.size = (await fs.stat(file.path)).size;
      await file.save();

      // Remove backup if everything succeeded
      await fs.unlink(backupPath);

      console.log('Successfully kept both records:', {
        fileId: id,
        rowNumbers: [group.rowNumber1, group.rowNumber2]
      });

      return res.json({
        success: true,
        message: "Records kept successfully"
      });
    } catch (error) {
      // Restore from backup if write failed
      await fs.copyFile(backupPath, file.path);
      await fs.unlink(backupPath);
      throw error;
    }
  } catch (error) {
    console.error('Error keeping records:', error);
    return res.status(500).json({
      success: false,
      message: "Error keeping records",
      error: error.message
    });
  }
};

// Export all controller functions
module.exports = {
  uploadFile,
  checkForDuplicatesHandler,
  listFiles,
  getFileById,
  downloadFile,
  deleteFile,
  mergeDuplicateRecords,
  keepBothRecords,
};