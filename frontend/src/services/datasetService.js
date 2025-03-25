import { API_ENDPOINTS } from '../config/api';
import { getAuthHeaders } from '../config/api';

export const datasetService = {
  // Fetch all datasets with optional filters
  async getDatasets(params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await fetch(`${API_ENDPOINTS.datasets}?${queryParams}`, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch datasets');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching datasets:', error);
      throw error;
    }
  },

  // Upload a new dataset
  async uploadDataset(formData) {
    try {
      const response = await fetch(`${API_ENDPOINTS.datasets}/upload`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          // Don't set Content-Type here as it will be set automatically for FormData
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload dataset');
      }

      return await response.json();
    } catch (error) {
      console.error('Error uploading dataset:', error);
      throw error;
    }
  },

  // Get dataset details
  async getDatasetDetails(id) {
    try {
      const response = await fetch(`${API_ENDPOINTS.datasets}/${id}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dataset details');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching dataset details:', error);
      throw error;
    }
  },

  // Download dataset
  async downloadDataset(id) {
    try {
      const response = await fetch(`${API_ENDPOINTS.datasets}/download/${id}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to download dataset');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dataset-${id}${getFileExtension(response)}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading dataset:', error);
      throw error;
    }
  },

  // Delete dataset
  async deleteDataset(id) {
    try {
      const response = await fetch(`${API_ENDPOINTS.datasets}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete dataset');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting dataset:', error);
      throw error;
    }
  }
};

// Helper function to get file extension from response headers
function getFileExtension(response) {
  const contentType = response.headers.get('content-type');
  const extensions = {
    'application/pdf': '.pdf',
    'application/json': '.json',
    'text/csv': '.csv',
    'application/vnd.ms-excel': '.xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
    'text/plain': '.txt'
  };
  return extensions[contentType] || '';
}

export default datasetService; 