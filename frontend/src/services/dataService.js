import { API_BASE_URL, API_CONFIG, API_ENDPOINTS, getAuthHeaders } from '../config/api';

// Upload Data function
export const uploadData = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/api/records/upload`, {
    method: 'POST',
    ...API_CONFIG,
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload file');
  }

  return await response.json();
};

// Export Report function
export const exportReport = async () => {
  const response = await fetch(`${API_BASE_URL}/api/records/export`, {
    method: 'GET',
    ...API_CONFIG,
  });

  if (!response.ok) {
    throw new Error('Failed to export data');
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ddas-report-${new Date().toISOString().split('T')[0]}.xlsx`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

// Get all duplicates
export const getDuplicates = async (searchQuery = '', matchConfidence = 0.8) => {
  try {
    const queryParams = new URLSearchParams({
      search: searchQuery,
      matchConfidence: matchConfidence
    });

    const response = await fetch(
      `${API_ENDPOINTS.DUPLICATES}?${queryParams}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
        ...API_CONFIG
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

// Get duplicate detection rules
export const getDuplicateRules = async () => {
  try {
    const response = await fetch(
      `${API_ENDPOINTS.RECORDS}/rules`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
        ...API_CONFIG
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
        ...API_CONFIG,
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

// Manage Data function
export const getAllRecords = async () => {
  const response = await fetch(`${API_BASE_URL}/api/records`, {
    method: 'GET',
    ...API_CONFIG,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch records');
  }

  return await response.json();
}; 