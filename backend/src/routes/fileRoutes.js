const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { auth } = require('../middleware/auth');
const fileController = require('../controllers/fileController');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads/temp'));
  },
  filename: function (req, file, cb) {
    // Create unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Accept csv, xlsx, and xls files
  const allowedTypes = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only CSV, XLSX and XLS files are allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Define routes without multer middleware where file upload is not needed
router.get('/', auth, fileController.listFiles);
router.get('/:id', auth, fileController.getFileById);
router.get('/download/:id/:format', auth, fileController.downloadFile);
router.delete('/:id', auth, fileController.deleteFile);

// Define routes that need multer middleware for file upload
router.post('/upload', auth, upload.single('file'), fileController.uploadFile);

// Check duplicates route - no file upload needed
router.post('/:id/check-duplicates', auth, fileController.checkForDuplicatesHandler);

// Duplicate handling routes
router.post('/:id/duplicates/merge', auth, fileController.mergeDuplicateRecords);
router.post('/:id/duplicates/keep-both', auth, fileController.keepBothRecords);

module.exports = router;
