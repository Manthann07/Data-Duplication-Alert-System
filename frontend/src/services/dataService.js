import { API_BASE_URL, API_ENDPOINTS, getAuthHeaders, handleApiError } from '../config/api';

// Upload file with metadata
export const uploadFile = async (file, metadata) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('department', metadata.department);
    formData.append('description', metadata.description);
    formData.append('tags', metadata.tags.join(','));

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.UPLOAD_FILE}`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders()
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Get all files with filtering and pagination
export const getFiles = async (params = {}) => {
  try {
    const {
      department = 'All Departments',
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = params;

    const queryParams = new URLSearchParams({
      department: department === 'All Departments' ? '' : department,
      ...(status && { status }),
      sortBy,
      sortOrder,
      page: page.toString(),
      limit: limit.toString()
    });

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.GET_FILES}?${queryParams}`, {
      method: 'GET',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch files');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Delete file
export const deleteFile = async (fileId) => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.DELETE_FILE}/${fileId}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders()
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete file');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Analyze file for duplicates
export const analyzeFile = async (fileId) => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ANALYZE_FILE}/${fileId}`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to analyze file');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Get all duplicates
export const getDuplicates = async (searchQuery = '', matchConfidence = 0.8) => {
  try {
    const queryParams = new URLSearchParams({
      search: searchQuery,
      matchConfidence: matchConfidence.toString()
    });

    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.DUPLICATES}?${queryParams}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch duplicates');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching duplicates:', error);
    throw error;
  }
};

// Get file-specific duplicates
export const getFileDuplicates = async (fileId) => {
  try {
    console.log('getFileDuplicates called with fileId:', fileId);
    const url = `${API_BASE_URL}/files/${fileId}/check-duplicates`;
    console.log('Constructed URL:', url);

    const headers = getAuthHeaders();
    console.log('Request headers:', headers);

    const response = await fetch(
      url,
      {
        method: 'POST',
        headers: headers,
      }
    );

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const responseText = await response.text();
      console.error('Error response body:', responseText);
      
      let errorMessage;
      try {
        const error = JSON.parse(responseText);
        errorMessage = error.message;
      } catch (parseError) {
        console.error('Error parsing response as JSON:', parseError);
        errorMessage = responseText;
      }
      
      throw new Error(errorMessage || 'Failed to fetch file duplicates');
    }

    const data = await response.json();
    console.log('Successful response data:', data);

    // Return the data directly without wrapping
    return data;
  } catch (error) {
    console.error('Error in getFileDuplicates:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    throw error;
  }
};

// Get duplicate detection rules
export const getDuplicateRules = async () => {
  try {
    const response = await fetch(
      `${API_ENDPOINTS.RECORDS}/rules`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch rules');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching rules:', error);
    throw error;
  }
};

// Update duplicate detection rules
export const updateDuplicateRules = async (rules) => {
  try {
    const response = await fetch(
      `${API_ENDPOINTS.RECORDS}/rules`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ rules })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update rules');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating rules:', error);
    throw error;
  }
};

// Keep both records
export const keepBothRecords = async (fileId, group) => {
  try {
    console.log('Keeping both records for group:', group);
    const response = await fetch(`${API_BASE_URL}/files/${fileId}/duplicates/keep-both`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        group: {
          id: group.id,
          rowNumber1: group.rowNumber1,
          rowNumber2: group.rowNumber2,
          record1: group.record1,
          record2: group.record2
        }
      })
    });

    const responseData = await response.text();
    console.log('Response from keep both:', responseData);

    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = JSON.parse(responseData);
        errorMessage = errorData.message;
      } catch (e) {
        errorMessage = responseData || 'Failed to keep both records';
      }
      throw new Error(errorMessage);
    }

    const result = responseData ? JSON.parse(responseData) : { success: true };
    if (!result.success) {
      throw new Error(result.message || 'Operation failed');
    }
    return result;
  } catch (error) {
    console.error('Error in keepBothRecords:', error);
    throw error;
  }
};

// Merge duplicate records
export const mergeDuplicateRecords = async (fileId, group) => {
  try {
    console.log('Merging records for group:', group);
    const response = await fetch(`${API_BASE_URL}/files/${fileId}/duplicates/merge`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        group: {
          id: group.id,
          rowNumber1: group.rowNumber1,
          rowNumber2: group.rowNumber2,
          record1: group.record1,
          record2: group.record2
        }
      })
    });

    const responseData = await response.text();
    console.log('Response from merge:', responseData);

    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = JSON.parse(responseData);
        errorMessage = errorData.message;
      } catch (e) {
        errorMessage = responseData || 'Failed to merge records';
      }
      throw new Error(errorMessage);
    }

    const result = responseData ? JSON.parse(responseData) : { success: true };
    if (!result.success) {
      throw new Error(result.message || 'Operation failed');
    }
    return result;
  } catch (error) {
    console.error('Error in mergeDuplicateRecords:', error);
    throw error;
  }
};

// Download processed file
export const downloadProcessedFile = async (fileId, format = 'csv') => {
  try {
    console.log('Downloading file:', { fileId, format });
    const response = await fetch(`${API_BASE_URL}/files/download/${fileId}/${format}`, {
      method: 'GET',
      headers: {
        ...getAuthHeaders(),
        'Accept': '*/*',
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    console.log('Download response:', response);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Download error response:', errorText);
      throw new Error(errorText || 'Failed to download file');
    }

    // Get the filename from Content-Disposition header if available
    const contentDisposition = response.headers.get('Content-Disposition');
    let filename = `processed_file.${format}`;
    if (contentDisposition) {
      const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
      if (matches != null && matches[1]) {
        filename = matches[1].replace(/['"]/g, '');
      }
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    return true;
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
};