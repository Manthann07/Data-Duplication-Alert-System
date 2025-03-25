const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  originalName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true,
    enum: ['XLSX', 'XLS', 'CSV']
  },
  filePath: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  accessLevel: {
    type: String,
    enum: ['private', 'public', 'shared'],
    default: 'private'
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'duplicate'],
    default: 'pending'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Create indexes for faster duplicate checking
recordSchema.index({ email: 1, createdBy: 1 });
recordSchema.index({ phone: 1, createdBy: 1 });
recordSchema.index({ name: 1, createdBy: 1 });

// Update the updatedAt timestamp before saving
recordSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Record = mongoose.model('Record', recordSchema);

module.exports = { Record }; 