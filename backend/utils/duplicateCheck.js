const crypto = require('crypto');
const File = require('../models/File');

/**
 * Generate a hash from file content for duplicate checking
 * @param {Buffer|String} fileContent - Content to hash
 * @returns {String} - SHA-256 hash of the content
 */
exports.generateFileHash = (fileContent) => {
  const hash = crypto.createHash('sha256');
  hash.update(typeof fileContent === 'string' ? fileContent : fileContent.toString());
  return hash.digest('hex');
};

/**
 * Check if a file with the same hash already exists
 * @param {String} fileHash - Hash of the file to check
 * @param {Number} fileSize - Size of the file to check
 * @returns {Promise<Array>} - Array of duplicate files found
 */
exports.checkDuplicate = async (fileHash, fileSize) => {
  try {
    // First check for exact matches using hash
    const exactDuplicates = await File.find({ fileHash })
      .populate('uploadedBy', 'username')
      .lean();
    
    if (exactDuplicates.length > 0) {
      return { 
        exact: exactDuplicates,
        similar: [] 
      };
    }

    // If no exact duplicates, check for similar files by size
    // Files within 5% size difference might be similar
    const lowerBound = fileSize * 0.95;
    const upperBound = fileSize * 1.05;
    
    const similarFiles = await File.find({
      fileHash: { $ne: fileHash },
      fileSize: { $gte: lowerBound, $lte: upperBound }
    })
    .populate('uploadedBy', 'username')
    .lean();
    
    return { 
      exact: [],
      similar: similarFiles 
    };
  } catch (error) {
    console.error('Error checking for duplicates:', error);
    throw error;
  }
};

/**
 * Find files with similar metadata
 * @param {Object} metadata - Metadata to compare
 * @returns {Promise<Array>} - Array of similar files found
 */
exports.findSimilarFiles = async (metadata) => {
  try {
    if (!metadata) return [];
    
    const query = {};
    
    // Add metadata search criteria if they exist
    if (metadata.period) {
      if (metadata.period.startDate) {
        query['metadata.period.startDate'] = { 
          $gte: new Date(metadata.period.startDate).setHours(0, 0, 0, 0),
          $lte: new Date(metadata.period.startDate).setHours(23, 59, 59, 999)
        };
      }
      
      if (metadata.period.endDate) {
        query['metadata.period.endDate'] = { 
          $gte: new Date(metadata.period.endDate).setHours(0, 0, 0, 0),
          $lte: new Date(metadata.period.endDate).setHours(23, 59, 59, 999)
        };
      }
    }
    
    if (metadata.spatialDomain) {
      query['metadata.spatialDomain'] = metadata.spatialDomain;
    }
    
    // Search for similar files based on metadata
    const similarFiles = await File.find(query)
      .populate('uploadedBy', 'username')
      .lean();
      
    return similarFiles;
  } catch (error) {
    console.error('Error finding similar files:', error);
    throw error;
  }
};

/**
 * Compare two files for similarity
 * @param {Object} fileA - First file to compare
 * @param {Object} fileB - Second file to compare
 * @returns {Number} - Similarity score between 0 and 1
 */
exports.calculateSimilarity = (fileA, fileB) => {
  let score = 0;
  let totalFactors = 0;
  
  // Compare file size (normalized difference)
  if (fileA.fileSize && fileB.fileSize) {
    const sizeDiff = Math.abs(fileA.fileSize - fileB.fileSize) / Math.max(fileA.fileSize, fileB.fileSize);
    score += (1 - sizeDiff);
    totalFactors++;
  }
  
  // Compare file type
  if (fileA.fileType && fileB.fileType) {
    if (fileA.fileType === fileB.fileType) {
      score += 1;
    }
    totalFactors++;
  }
  
  // Compare metadata if available
  if (fileA.metadata && fileB.metadata) {
    // Compare temporal overlap
    if (fileA.metadata.period && fileB.metadata.period) {
      const aStart = new Date(fileA.metadata.period.startDate);
      const aEnd = new Date(fileA.metadata.period.endDate);
      const bStart = new Date(fileB.metadata.period.startDate);
      const bEnd = new Date(fileB.metadata.period.endDate);
      
      // Check if periods overlap
      if (aStart <= bEnd && bStart <= aEnd) {
        score += 1;
      }
      totalFactors++;
    }
    
    // Compare spatial domain
    if (fileA.metadata.spatialDomain && fileB.metadata.spatialDomain) {
      if (fileA.metadata.spatialDomain === fileB.metadata.spatialDomain) {
        score += 1;
      }
      totalFactors++;
    }
  }
  
  // Return normalized score
  return totalFactors > 0 ? score / totalFactors : 0;
};