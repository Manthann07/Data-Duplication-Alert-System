const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { auth } = require('../middleware/auth');
const fileController = require('../controllers/fileController');
const { mergeDuplicateRecords, keepBothRecords } = require('../controllers/fileController');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const tempDir = path.join(__dirname, '../../uploads/temp');
        void fs.access(tempDir)
            .catch(() => fs.mkdir(tempDir, { recursive: true }))
            .finally(() => cb(null, tempDir));
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const fileFilter = function(req, file, cb) {
    console.log('Received file:', file);
    const allowedTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        // Common MIME types for CSV files
        'application/csv',
        'text/x-csv',
        'application/x-csv',
        'text/comma-separated-values',
        'text/x-comma-separated-values'
    ];
    
    if (allowedTypes.includes(file.mimetype) || file.originalname.endsWith('.csv')) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only CSV, XLS, and XLSX files are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// Middleware to handle multer errors
function handleMulterError(err, req, res, next) {
    if (err) {
        console.error('Multer error:', err);
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                res.status(400).json({
                    success: false,
                    message: 'File size too large. Maximum size is 10MB.'
                });
                return;
            }
            res.status(400).json({
                success: false,
                message: 'File upload error',
                error: err.message
            });
            return;
        }
        res.status(400).json({
            success: false,
            message: err.message
        });
        return;
    }
    next();
}

// Authentication and File Upload Routes
router.post('/upload', auth, function(req, res, next) {
    console.log('Upload route hit');
    console.log('Request headers:', req.headers);
    
    upload.single('file')(req, res, function(err) {
        if (err) {
            handleMulterError(err, req, res, next);
            return;
        }
        
        if (!req.file) {
            res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
            return;
        }

        console.log('File received:', req.file);
        console.log('Form data:', req.body);

        void fileController.uploadFile(req, res)
            .catch(function(error) {
                console.error('Error in upload controller:', error);
                if (!res.headersSent) {
                    res.status(500).json({
                        success: false,
                        message: 'Error processing file',
                        error: error.message
                    });
                }
            });
    });
});

router.post('/analyze', auth, function(req, res, next) {
    console.log('Analyze route hit');
    
    upload.single('file')(req, res, function(err) {
        if (err) {
            handleMulterError(err, req, res, next);
            return;
        }
        
        console.log('File uploaded successfully, calling controller');
        void fileController.checkForDuplicatesHandler(req, res)
            .catch(function(error) {
                console.error('Error in analyze controller:', error);
                if (!res.headersSent) {
                    res.status(500).json({
                        success: false,
                        message: 'Error processing file',
                        error: error.message
                    });
                }
            });
    });
});

// File Retrieval and Deletion Routes
router.get('/download/:id/:format?', auth, async (req, res) => {
    try {
        await fileController.downloadFile(req, res);
    } catch (error) {
        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                message: 'Error downloading file',
                error: error.message
            });
        }
    }
});

// Move this route after the download route to prevent conflicts
router.get('/:id', auth, function(req, res) {
    void fileController.getFileById(req, res)
        .catch(function(error) {
            if (!res.headersSent) {
                res.status(500).json({
                    success: false,
                    message: 'Error getting file',
                    error: error.message
                });
            }
        });
});

router.delete('/:id', auth, function(req, res) {
    void fileController.deleteFile(req, res)
        .catch(function(error) {
            if (!res.headersSent) {
                res.status(500).json({
                    success: false,
                    message: 'Error deleting file',
                    error: error.message
                });
            }
        });
});

router.post('/:id/duplicates/merge', auth, fileController.mergeDuplicateRecords);
router.post('/:id/duplicates/keep-both', auth, fileController.keepBothRecords);

// Error handling middleware
router.use(function(error, req, res, next) {
    console.error('Global error handler:', error);
    if (!res.headersSent) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

module.exports = router;
