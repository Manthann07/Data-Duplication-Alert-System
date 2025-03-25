const path = require('path');
const fs = require('fs');
const File = require('../models/File');
const DownloadHistory = require('../models/DownloadHistory');
const { generateFileHash, checkDuplicate, findSimilarFiles } = require('../../utils/duplicateCheck');

// Upload a new file
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { originalname, mimetype, size, path: filePath } = req.file;
    const fileContent = fs.readFileSync(filePath);
    const fileHash = generateFileHash(fileContent);
    
    // Check for duplicates before saving
    const duplicateCheck = await checkDuplicate(fileHash, size);
    
    if (duplicateCheck.exact.length > 0) {
      // If exact duplicate exists, remove uploaded file and inform user
      fs.unlinkSync(filePath);
      return res.status(409).json({ 
        message: 'Duplicate file detected',
        duplicates: duplicateCheck.exact
      });
    }
    
    // Extract any metadata from file if available
    // This would be implementation-specific based on file type
    const metadata = {
      // Default empty metadata
      period: {},
      spatialDomain: '',
      dataAttributes: {}
    };
    
    // If metadata was provided in form data
    if (req.body.metadata) {
      try {
        const parsedMetadata = JSON.parse(req.body.metadata);
        Object.assign(metadata, parsedMetadata);
      } catch (e) {
        console.error('Error parsing metadata:', e);
      }
    }

    // Create new file record
    const newFile = new File({
      fileName: originalname,
      fileSize: size,
      fileType: mimetype,
      filePath: filePath,
      fileHash: fileHash,
      uploadedBy: req.user.id,
      metadata: metadata
    });
    
    await newFile.save();

    // If similar files exist, let user know but don't block the upload
    const similarFiles = await findSimilarFiles(metadata);
    
    res.status(201).json({ 
      message: 'File uploaded successfully',
      file: newFile,
      similarFiles: similarFiles.length > 0 ? similarFiles : null
    });
    
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Server error uploading file' });
  }
};

// Get all files
exports.getAllFiles = async (req, res) => {
  try {
    const files = await File.find().populate('uploadedBy', 'username');
    res.json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ message: 'Server error fetching files' });
  }
};

// Get file by ID
exports.getFileById = async (req, res) => {
  try {
    const file = await File.findById(req.params.id).populate('uploadedBy', 'username');
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    res.json(file);
  } catch (error) {
    console.error('Error fetching file:', error);
    res.status(500).json({ message: 'Server error fetching file' });
  }
};

// Download a file
exports.downloadFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const userId = req.user.id;
    
    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    
    // Check if file exists on disk
    if (!fs.existsSync(file.filePath)) {
      return res.status(404).json({ message: 'File data not found' });
    }

    // Record download history
    const downloadRecord = new DownloadHistory({
      fileId: file._id,
      userId: userId
    });
    await downloadRecord.save();

    // Update download count
    file.downloadCount += 1;
    await file.save();

    // Send file
    res.download(file.filePath, file.fileName);
    
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ message: 'Server error downloading file' });
  }
};

// Check for duplicates before uploading
exports.checkForDuplicates = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided for check' });
    }

    const { size, path: filePath } = req.file;
    const fileContent = fs.readFileSync(filePath);
    const fileHash = generateFileHash(fileContent);
    
    // Check for exact duplicates and similar files
    const duplicateCheck = await checkDuplicate(fileHash, size);
    
    // Extract metadata if provided
    let metadata = {};
    if (req.body.metadata) {
      try {
        metadata = JSON.parse(req.body.metadata);
      } catch (e) {
        console.error('Error parsing metadata:', e);
      }
    }
    
    // Find files with similar metadata
    const similarByMetadata = await findSimilarFiles(metadata);
    
    // Remove the temporary file after check
    fs.unlinkSync(filePath);
    
    res.json({
      exactDuplicates: duplicateCheck.exact,
      similarBySize: duplicateCheck.similar,
      similarByMetadata: similarByMetadata
    });
    
  } catch (error) {
    console.error('Error checking for duplicates:', error);
    res.status(500).json({ message: 'Server error checking for duplicates' });
  }
};

// Get user's downloaded files
exports.getUserDownloads = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const downloads = await DownloadHistory.find({ userId })
      .populate({
        path: 'fileId',
        populate: {
          path: 'uploadedBy',
          select: 'username'
        }
      })
      .sort({ downloadedAt: -1 });
      
    const files = downloads.map(d => d.fileId);
    
    res.json(files);
  } catch (error) {
    console.error('Error fetching user downloads:', error);
    res.status(500).json({ message: 'Server error fetching user downloads' });
  }
};