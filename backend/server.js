require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs').promises;
const routes = require('./src/routes');

const app = express();
const port = process.env.PORT || 5000;

// Create required directories if they don't exist
const createRequiredDirectories = async () => {
  const dirs = [
    path.join(__dirname, 'logs'),
    path.join(__dirname, 'uploads'),
    path.join(__dirname, 'uploads', 'temp')
  ];

  for (const dir of dirs) {
    try {
      await fs.access(dir);
      console.log(`Directory exists: ${dir}`);
    } catch {
      console.log(`Creating directory: ${dir}`);
      try {
        await fs.mkdir(dir, { recursive: true });
        console.log(`Directory created: ${dir}`);
      } catch (err) {
        console.error(`Failed to create directory: ${dir}`, err);
        throw err;
      }
    }
  }
};

// Initialize directories
createRequiredDirectories().catch(err => {
  console.error('Failed to create required directories:', err);
  process.exit(1);
});

// Middleware
app.use(morgan('dev')); // Logging
app.use(cors({
  origin: ['http://localhost:8081', 'http://localhost:3000'], // Frontend URLs
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Accept',
    'Origin',
    'X-Requested-With'
  ],
  exposedHeaders: ['Content-Disposition', 'Content-Type'],
  credentials: true,
  maxAge: 86400 // Cache preflight request for 24 hours
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.json({ 
    status: isDbConnected ? 'ok' : 'error',
    message: isDbConnected ? 'Server is running' : 'Database connection error',
    dbStatus: isDbConnected ? 'connected' : 'disconnected',
    dbName: mongoose.connection.db?.databaseName || 'not connected'
  });
});

// Mount all routes under /api
app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Handle multer errors
  if (err.name === 'MulterError') {
    return res.status(400).json({
      success: false,
      message: 'File upload error',
      error: err.message
    });
  }

  // Handle other errors
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// MongoDB Connection
const connectDB = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('Connected to MongoDB');
      return;
    } catch (err) {
      console.error(`MongoDB connection attempt ${i + 1} failed:`, err);
      if (i === retries - 1) throw err;
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
    }
  }
};

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      console.log(`API URL: http://localhost:${port}/api`);
      console.log('MongoDB URI:', process.env.MONGODB_URI);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();