const mongoose = require('mongoose');

const downloadHistorySchema = new mongoose.Schema({
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  downloadedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add index for faster queries
downloadHistorySchema.index({ userId: 1, downloadedAt: -1 });
downloadHistorySchema.index({ fileId: 1 });

const DownloadHistory = mongoose.model('DownloadHistory', downloadHistorySchema);

module.exports = DownloadHistory; 