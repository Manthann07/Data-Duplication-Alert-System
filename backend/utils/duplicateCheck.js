const XLSX = require('xlsx');

/**
 * @typedef {Object} DuplicateResult
 * @property {boolean} hasDuplicates
 * @property {number} totalRecords
 * @property {Array<{record1: any, record2: any, similarity: number, rowNumber1: number, rowNumber2: number}>} duplicates
 * @property {Object} summary
 * @property {number} summary.totalDuplicatePairs
 * @property {number} summary.affectedRows
 */

const readExcelFile = (filePath) => {
    console.log('Attempting to read Excel file:', filePath);
    try {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        console.log(`Successfully read Excel file. Found ${data.length} records.`);
        return data;
    } catch (error) {
        console.error('Error reading Excel file:', error);
        return [];
    }
};

const readCSVFile = (filePath) => {
    console.log('Attempting to read CSV file:', filePath);
    try {
        const workbook = XLSX.readFile(filePath, { raw: true });
        const sheetName = workbook.SheetNames[0];
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        console.log(`Successfully read CSV file. Found ${data.length} records.`);
        return data;
    } catch (error) {
        console.error('Error reading CSV file:', error);
        return [];
    }
};

const calculateValueSimilarity = (val1, val2) => {
    if (val1 === val2) return 100;
    if (!val1 || !val2) return 0;

    // Handle numeric values
    if (typeof val1 === 'number' && typeof val2 === 'number') {
        const max = Math.max(Math.abs(val1), Math.abs(val2));
        if (max === 0) return 100;
        return (1 - Math.abs(val1 - val2) / max) * 100;
    }

    // Handle string values
    const str1 = String(val1).toLowerCase().trim();
    const str2 = String(val2).toLowerCase().trim();

    if (str1 === str2) return 100;

    let matches = 0;
    const length = Math.max(str1.length, str2.length);
    
    for (let i = 0; i < Math.min(str1.length, str2.length); i++) {
        if (str1[i] === str2[i]) matches++;
    }

    return (matches / length) * 100;
};

const calculateRecordSimilarity = (record1, record2) => {
    const keys1 = Object.keys(record1);
    const keys2 = Object.keys(record2);
    const allKeys = [...new Set([...keys1, ...keys2])];
    
    if (allKeys.length === 0) return 0;

    let totalSimilarity = 0;
    let totalWeight = 0;

    for (const key of allKeys) {
        // Skip if key doesn't exist in both records
        if (!record1.hasOwnProperty(key) || !record2.hasOwnProperty(key)) continue;

        // Calculate weight based on field type
        let weight = 1;
        if (key.toLowerCase().includes('id')) weight = 0.5; // Less weight for IDs
        if (key.toLowerCase().includes('name')) weight = 2; // More weight for names
        
        const similarity = calculateValueSimilarity(record1[key], record2[key]);
        totalSimilarity += similarity * weight;
        totalWeight += weight;
    }

    return totalWeight > 0 ? totalSimilarity / totalWeight : 0;
};

const compareRecords = (record1, record2) => {
    try {
        return calculateRecordSimilarity(record1, record2);
    } catch (error) {
        console.error('Error comparing records:', error);
        return 0;
    }
};

/**
 * @param {Array<any>} data
 * @returns {DuplicateResult}
 */
const findDuplicateRecords = (data) => {
    console.log('Starting duplicate detection process...');
    const duplicates = [];
    const threshold = 90; // 90% similarity threshold
    
    try {
        // Check each record against every other record
        for (let i = 0; i < data.length; i++) {
            for (let j = i + 1; j < data.length; j++) {
                const similarity = compareRecords(data[i], data[j]);
                
                // If similarity is above threshold
                if (similarity >= threshold) {
                    duplicates.push({
                        record1: data[i],
                        record2: data[j],
                        similarity: Math.round(similarity),
                        rowNumber1: i + 1,
                        rowNumber2: j + 1
                    });
                }
            }
            
            // Log progress every 100 records
            if (i % 100 === 0) {
                console.log(`Processed ${i}/${data.length} records...`);
            }
        }
        
        console.log(`Duplicate detection completed. Found ${duplicates.length} potential duplicates.`);
        
        return {
            hasDuplicates: duplicates.length > 0,
            totalRecords: data.length,
            duplicates: duplicates,
            summary: {
                totalDuplicatePairs: duplicates.length,
                affectedRows: new Set(duplicates.flatMap(d => [d.rowNumber1, d.rowNumber2])).size
            }
        };
    } catch (error) {
        console.error('Error finding duplicates:', error);
        return {
            hasDuplicates: false,
            totalRecords: 0,
            duplicates: [],
            summary: {
                totalDuplicatePairs: 0,
                affectedRows: 0
            }
        };
    }
};

/**
 * @param {string} filePath
 * @returns {Promise<DuplicateResult>}
 */
const checkForDuplicates = async (filePath) => {
    console.log('Starting file analysis for duplicates:', filePath);
    try {
        // Determine file type from extension
        const fileExt = filePath.toLowerCase().split('.').pop();
        console.log('File type detected:', fileExt);

        // Read the file based on its type
        let data;
        if (fileExt === 'xlsx' || fileExt === 'xls') {
            data = readExcelFile(filePath);
        } else if (fileExt === 'csv') {
            data = readCSVFile(filePath);
        } else {
            throw new Error('Unsupported file type');
        }

        if (data.length === 0) {
            console.log('No data found in file or file is empty');
            return {
                hasDuplicates: false,
                totalRecords: 0,
                duplicates: [],
                summary: {
                    totalDuplicatePairs: 0,
                    affectedRows: 0
                }
            };
        }

        console.log(`Successfully loaded ${data.length} records from file`);
        console.log('Sample record structure:', JSON.stringify(data[0], null, 2));

        // Find duplicates
        const result = findDuplicateRecords(data);
        
        console.log('Analysis completed:', {
            totalRecords: result.totalRecords,
            duplicatesFound: result.duplicates.length
        });

        return result;
    } catch (error) {
        console.error('Error in duplicate check process:', error);
        throw error;
    }
};

module.exports = {
    checkForDuplicates,
    readExcelFile,
    readCSVFile,
    compareRecords,
    findDuplicateRecords
};